import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

export const generateContent = async (req, res) => {
  try {
    const { contents } = req.body;
    const promptText = contents?.[0]?.parts?.[0]?.text || "";
    const inlineData = contents?.[0]?.parts?.[1]?.inline_data;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: promptText },
                ...(inlineData ? [{ inline_data: inlineData }] : []),
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
