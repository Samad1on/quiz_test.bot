import { Telegraf } from "telegraf";
import dotenv from "dotenv";

import {
  initUser,
  startQuiz,
  stopQuiz,
  answerHandler,
} from "./quiz.service.js";

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);

// ================= START =================
bot.start((ctx) => {
  initUser(ctx.from.id);

  ctx.reply("🎯 Smart Quiz Bot", {
    reply_markup: {
      inline_keyboard: [[{ text: "🚀 START", callback_data: "start" }]],
    },
  });
});

// ================= START QUIZ =================
bot.action("start", async (ctx) => {
  await ctx.answerCbQuery();
  startQuiz(ctx);
});

// ================= ANSWER =================
bot.action(/ans_(\d+)/, async (ctx) => {
  await ctx.answerCbQuery();
  answerHandler(ctx);
});

// ================= STOP =================
bot.action("stop", async (ctx) => {
  await ctx.answerCbQuery();
  stopQuiz(ctx);
});

bot.launch();

console.log("🤖 Bot running...");
