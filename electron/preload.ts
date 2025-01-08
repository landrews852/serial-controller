// preload.js
import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("serialAPI", {
  listSerialPorts: () => ipcRenderer.invoke("list-serial-ports"),
  openSerialPort: (
    portPath: string,
    options: {
      baudRate?: number;
      dataBits?: number;
      stopBits?: number;
      parity?: "none" | "even" | "odd";
    }
  ) => ipcRenderer.invoke("open-serial-port", portPath, options),
  closeSerialPort: () => ipcRenderer.invoke("close-serial-port"),
  onData: (callback: (data: string) => void) =>
    ipcRenderer.on("serial-data", (_event, data) => callback(data)),
  onStatus: (callback: (status: string) => void) =>
    ipcRenderer.on("serial-status", (_event, status) => callback(status)),
});

contextBridge.exposeInMainWorld("keyboardAPI", {
  onKeyPress: (callback: (event: KeyboardEvent) => void) =>
    ipcRenderer.on("keyboard-event", (_event, data) => callback(data)),
});

// Explicación:
// 	•	listSerialPorts: Solicita una lista de puertos seriales disponibles.
// 	•	openSerialPort: Abre un puerto serial específico con las opciones proporcionadas.
// 	•	closeSerialPort: Cierra el puerto serial actualmente abierto.
// 	•	onData: Escucha datos entrantes del puerto serial.
// 	•	onStatus: Escucha actualizaciones de estado relacionadas con el puerto serial.
