import 'dotenv/config';
import { createApp } from './app.js';
import { getActiveModel, isAiConfigured } from './aiService.js';

const port = Number(process.env.PORT) || 3001;
const app = createApp();

app.listen(port, () => {
  const configured = isAiConfigured();
  console.log(
    `[ScamShield API] Listening on http://localhost:${port} | AI configured: ${configured ? `YES (${getActiveModel()})` : 'NO (set GEMINI_API_KEY in .env)'}`
  );
});

