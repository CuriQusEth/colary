export default function handler(req: any, res: any) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

  if (req.method === 'GET') {
    return res.status(200).json({
      name: "Colary Orchestrator",
      status: "active",
      version: "1.0.0"
    });
  }

  if (req.method === 'POST') {
    return res.status(200).json({ status: "ok", action: "received", data: req.body });
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
