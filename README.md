# ORATRACK

School performance, attendance, analytics, and AI-agent prototype for Balili Elementary School.

## Run locally

```bash
npm install
npm run dev
```

## AI agent

ORA works immediately through a local demo agent that can analyze and modify the browser's fake data through reviewable actions.

To enable the real OpenAI path on Vercel:

1. Add `OPENAI_API_KEY` in the Vercel project's Environment Variables.
2. Optionally set `OPENAI_MODEL`. The default is `gpt-5.4-mini`.
3. Redeploy the project.

Never add a real API key to `.env.example`, source code, or GitHub.
