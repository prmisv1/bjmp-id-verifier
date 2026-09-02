export default async function handler(req, res) {
  const { id, lastName } = req.query;

  if (!id || !lastName) {
    return res.status(400).json({ 
      status: "error", 
      message: "Both ID Number and Last Name are required" 
    });
  }

  const googleScriptUrl = process.env.GOOGLE_SCRIPT_URL;

  if (!googleScriptUrl) {
    return res.status(500).json({ 
      status: "error", 
      message: "Server configuration error: Missing API URL" 
    });
  }

  try {
    const targetUrl = `${googleScriptUrl}?id=${encodeURIComponent(id)}&lastName=${encodeURIComponent(lastName)}`;
    const response = await fetch(targetUrl);
    const data = await response.json();

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ 
      status: "error", 
      message: "Failed to connect to verification database" 
    });
  }
}
