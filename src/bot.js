import { Telegraf } from "telegraf";
import dotenv from "dotenv";

dotenv.config();

// 👇 TO‘G‘RI IMPORT (MUHIM .js BOR)
import {
  startQuiz,
  stopQuiz,
  answerHandler,
  initUser,
} from "./handlers/quiz.handler.js";

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

// DEBUG
bot.on("callback_query", (ctx) => {
  console.log("CLICK:", ctx.callbackQuery.data);
});

// START
bot.action("start", async (ctx) => {
  await ctx.answerCbQuery();
  console.log("START WORKED");
  startQuiz(ctx);
});

// ================= STOP QUIZ =================
bot.action("stop", async (ctx) => {
  await ctx.answerCbQuery();
  stopQuiz(ctx);
});

// ================= ANSWER =================
// quiz.handler ichida answer format: answer_0, answer_1 ...
bot.action(/answer_(\d+)/, async (ctx) => {
  await ctx.answerCbQuery();
  answerHandler(ctx);
});

// ================= ERROR HANDLER =================
bot.catch((err, ctx) => {
  console.log("BOT ERROR:", err);
});

// ================= LAUNCH =================
bot.launch();

console.log("🤖 Quiz bot ishlayapti...");
