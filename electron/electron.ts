import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'node:path';
import { SerialPort } from 'serialport';
import { uIOhook } from 'uiohook-napi';

let mainWindow: BrowserWindow | null = null;
let currentPort: SerialPort | null = null;
const isDev = process.env.NODE_ENV === 'development';

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, 'index.html'));
  }
}

// Manejo de IPC para listar puertos seriales
ipcMain.handle('list-serial-ports', async () => {
  try {
    const ports = await SerialPort.list();
    return { success: true, ports };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
});

// Manejo de IPC para abrir un puerto serial
ipcMain.handle('open-serial-port', async (_event, portPath: string, options: { baudRate: number; dataBits?: number; stopBits?: number; parity?: string; }) => {
  try {
    if (currentPort?.isOpen) {
      currentPort.close();
    }

    currentPort = new SerialPort({ path: portPath, ...options });

    currentPort.on('open', () => {
      mainWindow?.webContents.send('serial-status', `Conectado a ${portPath}`);
    });

    currentPort.on('data', (data: Buffer) => {
      // Aquí conviertes Buffer a string
      const tecla = data.toString().trim();
      mainWindow?.webContents.send('serial-data', tecla);
    });

    currentPort.on('error', (err: Error) => {
      mainWindow?.webContents.send('serial-status', `Error: ${err.message}`);
    });

    currentPort.on('close', () => {
      mainWindow?.webContents.send('serial-status', 'Puerto cerrado');
    });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
});

// Manejo de IPC para cerrar el puerto serial
ipcMain.handle('close-serial-port', async () => {
  try {
    if (currentPort?.isOpen) {
      currentPort.close();
      currentPort = null;
      return { success: true };
    }
    return { success: false, error: 'No hay puerto abierto.' };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
});

// Manejo de uIOhook para eventos globales del teclado (ej. “bumpbar”)
uIOhook.on('keydown', (event) => {
  // event.keycode, event.shiftKey, etc.
  // Envía la info al renderer
  mainWindow?.webContents.send('keyboard-event', event);
});
uIOhook.start();

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});