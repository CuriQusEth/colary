import { NextResponse } from 'next/server';

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
    },
  });
}

export async function GET() {
  return NextResponse.json(
    { status: "MCP Server Active. Use POST for JSON-RPC." },
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { jsonrpc, id, method, params } = body || {};

    if (jsonrpc !== '2.0') {
      return NextResponse.json(
        { jsonrpc: "2.0", id: id || null, error: { code: -32600, message: "Invalid Request" } },
        { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } }
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
      return NextResponse.json(
        {
          jsonrpc: "2.0",
          id,
          result: {
            protocolVersion: "2024-11-05",
            capabilities: { tools: {}, prompts: {}, resources: {} },
            serverInfo: { name: "Colary Orchestrator", version: "1.0.0" }
          }
        },
        { status: 200, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }

    if (method === 'tools/list') {
      return NextResponse.json(
        { jsonrpc: "2.0", id, result: { tools } },
        { status: 200, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }

    if (method === 'tools/call') {
      const toolName = params?.name;
      return NextResponse.json(
        {
          jsonrpc: "2.0",
          id,
          result: { content: [{ type: "text", text: `Executed ${toolName} successfully.` }], isError: false }
        },
        { status: 200, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }

    if (method === 'prompts/list') {
      return NextResponse.json(
        { jsonrpc: "2.0", id, result: { prompts: [] } },
        { status: 200, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }

    if (method === 'resources/list') {
      return NextResponse.json(
        { jsonrpc: "2.0", id, result: { resources: [] } },
        { status: 200, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }

    return NextResponse.json(
      { jsonrpc: "2.0", id, error: { code: -32601, message: "Method not found" } },
      { status: 200, headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  }
}
