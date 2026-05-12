export default function handler(req: any, res: any) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

  if (req.method === 'GET') {
    return res.status(200).json({
      status: "ok",
      version: "1.0.0",
      capabilities: [
        "brain-training",
        "multi-game-management",
        "cognitive-exercises",
        "daily-training",
        "progress-tracking",
        "task-orchestration"
      ]
    });
  }

  if (req.method === 'POST') {
    return res.status(200).json({ status: "ok", received: req.body });
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
