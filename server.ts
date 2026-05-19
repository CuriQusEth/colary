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
    res.json({ status: "MCP Server Active. Use POST for JSON-RPC." });
  });

  app.post("/api/mcp", (req, res) => {
    const { jsonrpc, id, method, params } = req.body || {};

    if (jsonrpc !== '2.0') {
      return res.status(400).json({ jsonrpc: "2.0", id: id || null, error: { code: -32600, message: "Invalid Request" } });
    }

    const tools = [
      {
        name: "get_race_status",
        description: "returns current warp race state",
        inputSchema: { type: "object", properties: {}, required: [] }
      },
      {
        name: "start_race",
        description: "initiates a warp race session",
        inputSchema: { type: "object", properties: {}, required: [] }
      },
      {
        name: "get_leaderboard",
        description: "fetches competitive rankings",
        inputSchema: { type: "object", properties: {}, required: [] }
      },
      {
        name: "optimize_speed",
        description: "triggers performance optimization",
        inputSchema: { type: "object", properties: {}, required: [] }
      },
      {
        name: "get_track_info",
        description: "returns track metadata",
        inputSchema: { 
          type: "object", 
          properties: { trackId: { type: "string", description: "The ID of the track" } }, 
          required: ["trackId"] 
        }
      }
    ];

    if (method === 'initialize') {
      return res.status(200).json({
        jsonrpc: "2.0",
        id,
        result: {
          protocolVersion: "2024-11-05",
          capabilities: { tools: {}, prompts: {}, resources: {} },
          serverInfo: { name: "Colary Orchestrator", version: "1.0.0" }
        }
      });
    }

    if (method === 'tools/list') {
      return res.status(200).json({ jsonrpc: "2.0", id, result: { tools } });
    }

    if (method === 'tools/call') {
      const toolName = params?.name;
      return res.status(200).json({
        jsonrpc: "2.0",
        id,
        result: { content: [{ type: "text", text: `Executed ${toolName} successfully.` }], isError: false }
      });
    }

    if (method === 'prompts/list') {
      return res.status(200).json({ jsonrpc: "2.0", id, result: { prompts: [] } });
    }

    if (method === 'resources/list') {
      return res.status(200).json({ jsonrpc: "2.0", id, result: { resources: [] } });
    }

    return res.status(200).json({ jsonrpc: "2.0", id, error: { code: -32601, message: "Method not found" } });
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
