import cors from "cors";
import express from "express";
import { getNetworkSnapshot } from "./network.js";

const app = express();
const port = Number(process.env.PORT ?? 4000);

app.use(cors());

app.get("/api/network", async (_req, res) => {
  const snapshot = await getNetworkSnapshot();
  res.json(snapshot);
});

app.listen(port, () => {
  console.log(`Server jalan di http://localhost:${port}`);
});
