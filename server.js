const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.use(express.json({ limit: "20kb" }));

app.use(express.static(__dirname));


app.get("/api/health", (_req, res) => {
  res.json({ ok: true, apiKeyConfigured: Boolean(GEMINI_API_KEY) });
});

app.post("/api/chat", async (req, res) => {
  try {
    if (!GEMINI_API_KEY) {
      return res.status(503).json({
        error: "Server setup is incomplete: add GEMINI_API_KEY in the hosting service's environment/secrets settings."
      });
    }

    const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";
    if (!message) return res.status(400).json({ error: "Please enter a question." });
    if (message.length > 1000) return res.status(400).json({ error: "Please keep your question under 1000 characters." });

    const apiResponse = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": GEMINI_API_KEY
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{
              text: "You are Student Dost, a friendly educational tutor. Explain clearly for a school student. Support simple English, Hindi, and Urdu/Roman Urdu. Break hard topics into steps, use examples, and encourage learning rather than simply doing graded work. If a question is unclear, ask a short clarification."
            }]
          },
          contents: [{ role: "user", parts: [{ text: message }] }],
          generationConfig: { temperature: 0.6, maxOutputTokens: 900 }
        })
      }
    );

    const data = await apiResponse.json().catch(() => ({}));
    if (!apiResponse.ok) {
      const detail = data?.error?.message || "Gemini API request failed.";
      return res.status(502).json({ error: detail });
    }

    const reply = (data?.candidates?.[0]?.content?.parts || [])
      .map(part => part.text || "")
      .join("")
      .trim();

    if (!reply) return res.status(502).json({ error: "Gemini returned an empty answer. Please try again." });
    return res.json({ reply });
  } catch (error) {
    console.error("Tutor error:", error);
    return res.status(500).json({ error: "A server error occurred. Please try again." });
  }
});

app.listen(PORT, () => {
  console.log(`Student Dost is running on port ${PORT}`);
});
