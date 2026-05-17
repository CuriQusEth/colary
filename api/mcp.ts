export default async function handler(req: any, res: any) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({ status: "MCP Server Active. Use POST for JSON-RPC." });
  }

  if (req.method === 'POST') {
    const { jsonrpc, id, method, params } = req.body || {};

    if (jsonrpc !== '2.0') {
      return res.status(400).json({ jsonrpc: "2.0", id, error: { code: -32600, message: "Invalid Request" } });
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
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}