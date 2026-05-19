export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
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
      JSON.stringify({
        name: "Colary Orchestrator",
        status: "active",
        version: "1.0.0"
      }),
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
      return new Response(
        JSON.stringify({ status: "ok", action: "received", data: body }),
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
