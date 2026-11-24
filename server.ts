import dotenv from "dotenv";
import express from "express";
import path from "path";
import { handleAdvise } from "./src/app/api/advise/route.ts";

dotenv.config({ path: ".env.local" });
dotenv.config();

async function startServer() {
  const app = express();
  app.use(express.json());

  app.post("/api/advise", async (req, res) => {
    const result = await handleAdvise(req.body);
    res.status(result.status).json(result.payload);
  });

  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), "dist");
    app.use(express.static(distDir));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distDir, "index.html"));
    });
  }

  app.listen(3000, "0.0.0.0", () => {
    console.log("Server listening on http://0.0.0.0:3000");
  });
}

startServer();
