import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // CORS for external API usage
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // MCP Route
  app.get("/api/mcp", (req, res) => {
    res.json({
      status: "ok",
      version: "1.0.0",
      capabilities: {
        tools: {},
        prompts: {},
        resources: {}
      },
      tools: [
        {
          name: "calculate_score",
          description: "Calculates the cognitive score of a user.",
          inputSchema: {
            type: "object",
            properties: {
              userId: { type: "string", description: "The ID of the user" }
            },
            required: ["userId"]
          }
        }
      ],
      prompts: [
        {
          name: "daily_workout",
          description: "Starts daily workout sequence"
        }
      ],
      resources: [
        {
          uri: "colary://data/leaderboard",
          name: "Leaderboard Data",
          description: "Current global leaderboard"
        }
      ]
    });
  });

  app.post("/api/mcp", (req, res) => {
    res.json({ status: "ok", received: req.body });
  });

  // Agent Route
  app.get("/api/agent", (req, res) => {
    res.json({
      name: "Colary Orchestrator",
      status: "active",
      version: "1.0.0"
    });
  });

  app.post("/api/agent", (req, res) => {
    res.json({ status: "ok", action: "received", data: req.body });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    
    // Express v4/v5 SPA fallback
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
