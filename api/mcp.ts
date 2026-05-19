export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  const url = new URL(req.url);

  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
      },
    });
  }

  if (req.method === 'GET') {
    return new Response(
      JSON.stringify({ status: "MCP Server Active. Use POST for JSON-RPC." }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }

  if (req.method === 'POST') {
    try {
      const body = await req.json();
      const { jsonrpc, id, method, params } = body || {};

      if (jsonrpc !== '2.0') {
        return new Response(
          JSON.stringify({ jsonrpc: "2.0", id: id || null, error: { code: -32600, message: "Invalid Request" } }),
          { status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
        );
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
        return new Response(
          JSON.stringify({
            jsonrpc: "2.0",
            id,
            result: {
              protocolVersion: "2024-11-05",
              capabilities: { tools: {}, prompts: {}, resources: {} },
              serverInfo: { name: "Colary Orchestrator", version: "1.0.0" }
            }
          }),
          { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
        );
      }

      if (method === 'tools/list') {
        return new Response(
          JSON.stringify({ jsonrpc: "2.0", id, result: { tools } }),
          { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
        );
      }

      if (method === 'tools/call') {
        const toolName = params?.name;
        return new Response(
          JSON.stringify({
            jsonrpc: "2.0",
            id,
            result: { content: [{ type: "text", text: `Executed ${toolName} successfully.` }], isError: false }
          }),
          { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
        );
      }

      if (method === 'prompts/list') {
        return new Response(
          JSON.stringify({ jsonrpc: "2.0", id, result: { prompts: [] } }),
          { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
        );
      }

      if (method === 'resources/list') {
        return new Response(
          JSON.stringify({ jsonrpc: "2.0", id, result: { resources: [] } }),
          { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
        );
      }

      return new Response(
        JSON.stringify({ jsonrpc: "2.0", id, error: { code: -32601, message: "Method not found" } }),
        { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ error: "Internal Server Error" }),
        { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
      );
    }
  }

  return new Response("Method Not Allowed", { status: 405 });
}
