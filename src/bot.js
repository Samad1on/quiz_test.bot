import { Telegraf } from "telegraf";
import dotenv from "dotenv";

import {
  startQuiz,
  stopQuiz,
  answerHandler,
  initUser,
} from "./handlers/quiz.handler.js";

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);

// ================= START =================
bot.start((ctx) => {
  initUser(ctx.from.id);

  ctx.reply("🎯 Quiz Bot Ready", {
    reply_markup: {
      inline_keyboard: [[{ text: "🚀 Boshlash", callback_data: "start" }]],
    },
  });
});

// ================= START QUIZ =================
bot.action("start", (ctx) => {
  ctx.answerCbQuery();
  startQuiz(ctx);
});

// ================= STOP =================
bot.action("stop", (ctx) => {
  ctx.answerCbQuery();
  stopQuiz(ctx);
});

// ================= ANSWER =================
bot.action(/answer_(\d+)/, (ctx) => {
  ctx.answerCbQuery();
  answerHandler(ctx);
});

// ================= LAUNCH =================
bot.launch();

console.log("🤖 Bot ishlayapti...");
