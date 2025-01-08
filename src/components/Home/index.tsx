import { useState, useEffect } from 'react';
import useSerialPort from '../../hooks/useSerialPort';

export default function HomeSerialController() {
  const [port, setPort] = useState<string>();
  const { ports, loadPorts, openPort, connected } = useSerialPort();

  useEffect(() => {
    loadPorts()
  }, [loadPorts])

  if (connected) {
    return <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-black">Conectado correctamente...</h2>
    </div >
  }

  if (!ports?.length) {
    return <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-black">No se han encontrado puertos seriales</h2>
    </div >
  }

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-black">Serial Port Controller</h2>
      {/* <button type="button" className="bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded">Personalizar hotkeys</button> */}
      <div className="mb-4">
        <select
          value={port}
          onChange={(e) => setPort(e.target.value)}
          className="w-full p-2 border rounded-lg bg-white"
        >
          <option value="">Seleccione un puerto</option>
          {ports.map((port) => (
            <option key={port.path} value={port.path}>
              {port.path}
            </option>
          ))}

          {port ? <button type="button" className="bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded" onClick={async () => {
            openPort({
              path: port, options: {
                baudRate: 9600,
                dataBits: 8,
                parity: "none",
                stopBits: 1,
              }
            })
          }}>Conectar</button> : <button type="button" className="bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded" onClick={async () => {
            loadPorts()
          }}>Cargar puertos</button>}
        </select>
      </div>

    </div >
  );
};