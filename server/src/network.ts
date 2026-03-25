import { exec } from "node:child_process";
import { promisify } from "node:util";

const execAsync = promisify(exec);

export type Device = {
  ip: string;
  mac: string;
  hostname: string;
};

export type NetworkSnapshot = {
  wifiName: string;
  devices: Device[];
  note: string;
};

function parseArpTable(raw: string): Device[] {
  const lines = raw.split("\n").map((line) => line.trim()).filter(Boolean);

  return lines
    .map((line) => {
      const parts = line.split(/\s+/);
      if (parts.length < 3) {
        return null;
      }

      // Format umum Linux: ? (192.168.1.2) at aa:bb:cc:dd:ee:ff [ether] on wlan0
      const ipMatch = line.match(/\((\d+\.\d+\.\d+\.\d+)\)/);
      const macMatch = line.match(/at\s+([0-9a-f:]{17})/i);

      if (!ipMatch || !macMatch) {
        return null;
      }

      return {
        ip: ipMatch[1],
        mac: macMatch[1],
        hostname: "Unknown"
      } satisfies Device;
    })
    .filter((item): item is Device => item !== null);
}

async function detectWifiName(): Promise<string> {
  try {
    const { stdout } = await execAsync("nmcli -t -f active,ssid dev wifi | egrep '^yes:' | cut -d: -f2");
    const ssid = stdout.trim();
    return ssid || "Tidak terdeteksi";
  } catch {
    return "Tidak terdeteksi";
  }
}

export async function getNetworkSnapshot(): Promise<NetworkSnapshot> {
  const wifiName = await detectWifiName();

  let devices: Device[] = [];

  try {
    const { stdout } = await execAsync("arp -a");
    devices = parseArpTable(stdout);
  } catch {
    devices = [];
  }

  return {
    wifiName,
    devices,
    note: "Aplikasi ini hanya menampilkan perangkat dari ARP table lokal. Demi keamanan, password Wi-Fi tidak dibaca otomatis."
  };
}
