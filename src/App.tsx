// src/App.tsx
import { useEffect, useState } from 'react';
import type { IpcRendererEvent } from 'electron';
import HomeSerialController from './components/Home';

declare global {
  interface Window {
    electronAPI: {
      receiveMessage: (callback: (event: IpcRendererEvent, message: string) => void) => void;
      sendMessage: (message: string) => void;
    };
  }
}

function App() {
  // const [message, setMessage] = useState('');
  // const [reply, setReply] = useState('');

  // const sendMessage = () => {
  //   window.electronAPI.sendMessage(message);
  // };

  // useEffect(() => {
  //   window.electronAPI.receiveMessage((_event, response: string) => {
  //     setReply(response);
  //   });
  // }, []);

  return (
    <div className="App">
      <HomeSerialController />
    </div>
  );
}

export default App;