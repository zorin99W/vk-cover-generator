import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const isProduction = process.env.NODE_ENV === "production";
const PORT = 3000;

// Initialize GoogleGenAI client lazily to avoid startup crashes if key is missing
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error(
        "GEMINI_API_KEY env variable is not set. Please set it in Settings."
      );
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Check Endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "healthy", time: new Date().toISOString() });
  });

  // Gemini AI Slogan Generator API Endpoint
  app.post("/api/slogans", async (req, res) => {
    const { keywords, tone } = req.body;
    try {
      const ai = getGeminiClient();
      const promptText = `
        Ты — профессиональный дизайнер и копирайтер для социальных сетей (ВКонтакте).
        Сделай 5 вариантов привлекательных, лаконичных текстов для обложки группы ВКонтакте (разрешение 1920x768) на основе следующих ключевых слов или описания бизнеса:
        "${keywords || 'Артем ИИ Интегратор, ИИ-Агенты, Чат-боты, Автоматизация бизнеса'}".
        Тональность и стиль: ${tone || 'профессиональный, футуристичный, деловой'}.
        Для каждого варианта сгенерируй:
        1. Заголовок (Title)
        2. Подзаголовок (Subtitle)
        3. Список из 4-5 ключевых фич/тегов
        4. Призыв к действию (CTA)
        5. Рекомендация светлой или тёмной темы.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptText,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              variants: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    subtitle: { type: Type.STRING },
                    features: { type: Type.ARRAY, items: { type: Type.STRING } },
                    cta: { type: Type.STRING },
                    isDarkTheme: { type: Type.BOOLEAN },
                  },
                  required: ["title", "subtitle", "features", "cta", "isDarkTheme"],
                },
              },
            },
            required: ["variants"],
          },
        },
      });

      const responseText = response.text;
      if (!responseText) throw new Error("No response from Gemini API");
      const parsedData = JSON.parse(responseText.trim());
      res.json(parsedData);
    } catch (error: any) {
      console.error("Gemini Slogan Generator Error:", error);
      res.status(500).json({ error: error.message || "Failed to generate slogans" });
    }
  });

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server started in ${isProduction ? "production" : "development"} mode on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Fatal server startup error:", err);
});
