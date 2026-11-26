import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { createApp } from './app.js';
import { getActiveModel, isAiConfigured } from './aiService.js';
const currentDir = path.dirname(fileURLToPath(import.meta.url));
const rootEnvPath = path.resolve(currentDir, '..', '.env');
const serverEnvPath = path.join(currentDir, '.env');
function loadEnvFileWithoutEmptyOverrides(filePath) {
    if (!fs.existsSync(filePath))
        return;
    const parsed = dotenv.parse(fs.readFileSync(filePath));
    for (const [key, value] of Object.entries(parsed)) {
        const existing = process.env[key]?.trim();
        if (!existing && value.trim()) {
            process.env[key] = value.trim();
        }
    }
}
loadEnvFileWithoutEmptyOverrides(rootEnvPath);
loadEnvFileWithoutEmptyOverrides(serverEnvPath);
const port = Number(process.env.PORT) || 3001;
const app = createApp();
app.listen(port, () => {
    const configured = isAiConfigured();
    console.log(`[ScamShield API] Listening on http://localhost:${port} | AI configured: ${configured ? `YES (${getActiveModel()})` : 'NO (set GEMINI_API_KEY in .env)'}`);
});
