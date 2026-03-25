# Wi-Fi Dashboard (React + Node.js + TypeScript)

Aplikasi ini menampilkan:
- Nama Wi-Fi (SSID) yang sedang aktif (jika tersedia via `nmcli`).
- Daftar perangkat yang terdeteksi dari ARP table lokal.

> Demi keamanan dan privasi, aplikasi **tidak** mengambil atau menampilkan password Wi-Fi secara otomatis.

## Menjalankan

```bash
npm install
npm run dev
```

- Backend: `http://localhost:4000`
- Frontend: `http://localhost:5173`
