# Gemini setup for Lumière

## 1. Get a Gemini API key

Create a Gemini API key in Google AI Studio:
https://aistudio.google.com/apikey

## 2. Local development

Create a file named `.env` in the project root (do not commit it) and add:

```env
GEMINI_API_KEY=your_real_key_here
GEMINI_MODEL=gemini-2.5-flash
```

Restart the dev server after changing `.env`.

## 3. Run the app

```bash
npm install
npm run dev
```

Then open the local URL shown by Vite.

## 4. Vercel

In Vercel, open:

Project -> Settings -> Environment Variables

Add:

- `GEMINI_API_KEY`
- `GEMINI_MODEL` = `gemini-2.5-flash`

Do not put the Gemini key in `VITE_*` variables and do not commit `.env`.

## 5. Troubleshooting

When you press **Generate my report**, the button calls the TanStack server function and the server calls Gemini. If it fails, the UI now shows the server error message and logs the detailed error in the browser/server console.

Common causes:

- `Missing GEMINI_API_KEY`: your `.env`/Vercel environment variable is not set.
- `Gemini API error: 400`: request/model configuration issue.
- `Gemini API error: 401/403`: invalid, restricted, or unavailable API key.
- `Gemini API error: 429`: rate limit/quota reached.
