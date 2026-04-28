import { Telegraf } from "telegraf";
import dotenv from "dotenv";
import { startQuiz } from "./quiz.handler.js";

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);

// START MESSAGE
bot.start((ctx) => {
  ctx.reply("🎯 Quiz Bot Ready", {
    reply_markup: {
      inline_keyboard: [[{ text: "🚀 Boshlash", callback_data: "start" }]],
    },
  });
});

// DEBUG (MUHIM)
bot.on("callback_query", (ctx) => {
  console.log("CLICK:", ctx.callbackQuery.data);
});

// START ACTION
bot.action("start", async (ctx) => {
  await ctx.answerCbQuery();
  console.log("START BOSILDI");
  startQuiz(ctx);
});

bot.launch();

console.log("🤖 Bot started");
