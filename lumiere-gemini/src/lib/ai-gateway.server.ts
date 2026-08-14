// Server-only helper for calling Google's Gemini API.
// The Gemini API key is read only on the server from GEMINI_API_KEY.

export interface AIChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function callGeminiAI(opts: {
  model?: string;
  messages: AIChatMessage[];
  responseSchema?: Record<string, unknown>;
}): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Missing GEMINI_API_KEY. Add your Gemini API key to the server environment variables.",
    );
  }

  const model = opts.model ?? process.env.GEMINI_MODEL ?? "gemini-2.5-flash";
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;

  const contents = opts.messages
    .filter((message) => message.role !== "system")
    .map((message) => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: message.content }],
    }));

  const systemInstruction = opts.messages.find((message) => message.role === "system")?.content;

  const body: Record<string, unknown> = {
    contents,
    generationConfig: {
      responseMimeType: "application/json",
      ...(opts.responseSchema ? { responseJsonSchema: opts.responseSchema } : {}),
    },
  };

  if (systemInstruction) {
    body.systemInstruction = {
      parts: [{ text: systemInstruction }],
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 120_000);

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    const data = (await res.json()) as {
      error?: { message?: string };
      candidates?: Array<{
        content?: {
          parts?: Array<{ text?: string }>;
        };
      }>;
    };

    if (!res.ok) {
      const message = data.error?.message ?? `Gemini request failed (${res.status})`;
      throw new Error(`Gemini API error: ${message}`);
    }

    const content = data.candidates?.[0]?.content?.parts
      ?.map((part) => part.text ?? "")
      .join("")
      .trim();

    if (!content) {
      throw new Error("Gemini returned an empty response");
    }

    return content;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("The Gemini request timed out. Please try again.");
    }
    if (error instanceof TypeError) {
      throw new Error("Could not connect to the Gemini API. Check your internet connection.");
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
