// src/App.tsx
import { useEffect, useState } from 'react';
import type { IpcRendererEvent } from 'electron';

declare global {
  interface Window {
    electronAPI: {
      receiveMessage: (callback: (event: IpcRendererEvent, message: string) => void) => void;
      sendMessage: (message: string) => void;
    };
  }
}

function App() {
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState('');

  const sendMessage = () => {
    window.electronAPI.sendMessage(message);
  };

  useEffect(() => {
    window.electronAPI.receiveMessage((_event, response: string) => {
      setReply(response);
    });
  }, []);

  return (
    <div className="App">
      <h1>Electron + React + Vite + TypeScript</h1>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Escribe un mensaje"
      />
      <button type="button" onClick={sendMessage}>Enviar</button>
      {reply && <p>Respuesta: {reply}</p>}
    </div>
  );
}

export default App;