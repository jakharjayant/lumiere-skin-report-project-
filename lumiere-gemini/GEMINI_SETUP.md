# Lumière — Gemini AI Setup

Lumière uses Google's Gemini API for personalized skin reports. The browser never receives the Gemini API key; the key is read on the server from `GEMINI_API_KEY`.

## 1. Get a Gemini API key

Create a Gemini API key in Google AI Studio. Use the free tier where available and stay within its current rate limits and usage terms.

## 2. Local development

Create `.env` from `.env.example` and set:

```env
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
```

Then run:

```bash
npm install
npm run dev
```

No Ollama installation or local model is required.

## 3. Vercel deployment

In Vercel, open the project settings and add these Environment Variables:

```text
GEMINI_API_KEY = your_gemini_api_key
GEMINI_MODEL = gemini-2.5-flash
```

Do not put the Gemini key in frontend code, `VITE_*` variables, or GitHub.

## 4. AI request flow

```text
Questionnaire
    ↓
TanStack Start server function
    ↓
Gemini API (gemini-2.5-flash)
    ↓
Structured JSON skin report
    ↓
Existing Lumière report UI
```

The report-generation prompt and UI schema are preserved; only the AI provider is changed.
