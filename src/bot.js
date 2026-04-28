import { Telegraf } from "telegraf";
import dotenv from "dotenv";

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);

// ================= START =================
bot.start((ctx) => {
  ctx.reply("🎯 Quiz Bot Ready", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "🚀 Boshlash", callback_data: "start" }],
        [{ text: "⛔ Stop", callback_data: "stop" }],
      ],
    },
  });
});

// ================= DEBUG (ENG MUHIM) =================
bot.on("callback_query", (ctx) => {
  console.log("CLICKED:", ctx.callbackQuery.data);
});

// ================= START ACTION =================
bot.action("start", async (ctx) => {
  await ctx.answerCbQuery();

  console.log("START WORKED");

  await ctx.reply("🚀 Quiz boshlandi!");
});

// ================= STOP ACTION =================
bot.action("stop", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply("⛔ Stop qilindi!");
});

// ================= ERROR =================
bot.catch((err) => {
  console.log("BOT ERROR:", err);
});

bot.launch();

console.log("BOT RUNNING");
