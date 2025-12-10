import { bot } from "@/shared/lib";

// const URL = process.env.BASE_URL || "http://localhost:3000"
const URL = "http://localhost:3000"

export async function GET() {
  const webhookUrl = `${URL}/api/telegram`;

  await bot.telegram.setWebhook(webhookUrl);

  return new Response(`Webhook set to ${webhookUrl}`);
}
