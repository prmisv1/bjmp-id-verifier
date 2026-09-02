export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ status: "error", message: "No ID provided" });
  }

  const googleScriptUrl = process.env.GOOGLE_SCRIPT_URL;

  if (!googleScriptUrl) {
    return res.status(500).json({ status: "error", message: "Server configuration error: Missing API URL" });
  }

  try {
    const response = await fetch(`${googleScriptUrl}?id=${encodeURIComponent(id)}`);
    const data = await response.json();

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ status: "error", message: "Failed to connect to verification database" });
  }
}