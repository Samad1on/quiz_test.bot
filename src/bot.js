import { Telegraf } from "telegraf";
import dotenv from "dotenv";

import { initUser, startQuiz, stopQuiz, answerHandler } from "./quiz.js";

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);

// ================= START =================
bot.start(async (ctx) => {
  initUser(ctx);

  await ctx.reply("🎯 Quiz Bot Ready", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "🚀 Testni boshlash", callback_data: "start_test" }],
      ],
    },
  });
});

// ================= START TEST =================
bot.action("start_test", async (ctx) => {
  await ctx.answerCbQuery();
  startQuiz(ctx, bot);
});

// ================= STOP TEST =================
bot.action("stop", async (ctx) => {
  await ctx.answerCbQuery();
  stopQuiz(ctx);
});

// ================= ANSWER =================
bot.action(/ans_(\d+)/, async (ctx) => {
  await ctx.answerCbQuery();

  const answerIndex = ctx.match[1];
  answerHandler(ctx, bot, Number(answerIndex));
});

// ================= LAUNCH =================
bot.launch().then(() => {
  console.log("🤖 Bot started");
});
