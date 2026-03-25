import { useEffect, useState } from "react";

type Device = {
  ip: string;
  mac: string;
  hostname: string;
};

type Snapshot = {
  wifiName: string;
  devices: Device[];
  note: string;
};

export function App() {
  const [data, setData] = useState<Snapshot | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:4000/api/network")
      .then((res) => res.json())
      .then((json: Snapshot) => setData(json))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p style={{ fontFamily: "sans-serif" }}>Memuat data jaringan...</p>;
  }

  return (
    <main style={{ fontFamily: "sans-serif", margin: "2rem auto", maxWidth: 800 }}>
      <h1>Dashboard Jaringan Wi-Fi</h1>
      <p>
        <strong>Nama Wi-Fi:</strong> {data?.wifiName}
      </p>
      <p>{data?.note}</p>

      <h2>Perangkat terdeteksi</h2>
      <table width="100%" cellPadding={8} style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th align="left">Hostname</th>
            <th align="left">IP</th>
            <th align="left">MAC</th>
          </tr>
        </thead>
        <tbody>
          {data?.devices.length ? (
            data.devices.map((device) => (
              <tr key={`${device.ip}-${device.mac}`}>
                <td>{device.hostname}</td>
                <td>{device.ip}</td>
                <td>{device.mac}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3}>Belum ada perangkat dari ARP table.</td>
            </tr>
          )}
        </tbody>
      </table>
    </main>
  );
}
