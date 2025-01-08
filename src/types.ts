export type ActionType =
  | "ArrowLeft"
  | "ArrowRight"
  | "ArrowUp5Times"
  | "ArrowDown5Times"
  | "Space";

export interface SerialPortOptions {
  baudRate: number;
  dataBits: 5 | 6 | 7 | 8;
  parity: "none" | "even" | "odd";
  stopBits: 1 | 1.5 | 2;
  xon?: boolean;
  xoff?: boolean;
  rtscts?: boolean;
  autoOpen?: boolean;
}

export interface Hotkey {
  key: string;
  action: ActionType;
}

export interface SerialAPI {
  listSerialPorts: () => Promise<{
    success: boolean;
    ports?: { path: string }[];
    error?: string;
  }>;
  openSerialPort: (data: {
    path: string;
    options: SerialPortOptions;
    onData: (key: string) => void;
    onConnect: () => void;
    onError: () => void;
  }) => Promise<{ success: boolean; error?: string }>;
  closeSerialPort: () => Promise<{ success: boolean; error?: string }>;
  onData: (callback: (data: string) => void) => void;
  onStatus: (callback: (status: string) => void) => void;
  isConnected: () => boolean;
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const electronAPI = (window as any).serialAPI as SerialAPI;
