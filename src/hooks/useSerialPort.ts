import { useState, useEffect } from "react";
import { ActionType, Hotkey, electronAPI } from "../types";
import useHotKeys from "./useHotKeys";
import type { SerialPortOptions } from "../types";

export default function useSerialPort() {
  const sendHotKey = useHotKeys();
  const [ports, setPorts] = useState<{ path: string }[]>([]);
  const [selectedPort, setSelectedPort] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [connected, setConnected] = useState<boolean>();

  const openPort = (params: { path: string; options?: SerialPortOptions }) => {
    const { path, options = {} as SerialPortOptions } = params;

    if (!path) {
      electronAPI?.closeSerialPort();
      return;
    }

    electronAPI?.openSerialPort({
      path: selectedPort,
      options,
      onConnect: () => {
        setSelectedPort(path);
        setConnected(true);
      },
      onData: (data: string) => {
        sendHotKey(data);
      },
      onError: () => {
        setSelectedPort("");
        setConnected(false);
      },
    });
  };

  const loadPorts = async () => {
    const response = await electronAPI?.listSerialPorts();
    setPorts(response.success && response.ports ? response.ports : []);
  };

  return {
    status,
    ports,
    selectedPort,
    connected,
    openPort,
    loadPorts,
  };
}
