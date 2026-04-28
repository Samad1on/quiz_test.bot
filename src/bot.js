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

// START
bot.start((ctx) => {
  initUser(ctx.from.id);

  ctx.reply("🎯 Quiz Bot Ready", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "🚀 Boshlash", callback_data: "start" }],
        [{ text: "⛔ Stop", callback_data: "stop" }],
      ],
    },
  });
});

// DEBUG (MUST HAVE)
bot.on("callback_query", (ctx) => {
  console.log("CLICK:", ctx.callbackQuery.data);
});

// START QUIZ
bot.action("start", async (ctx) => {
  try {
    await ctx.answerCbQuery();
    console.log("START PRESSED");
    startQuiz(ctx);
  } catch (e) {
    console.log("START ERROR:", e);
    ctx.reply("Xatolik chiqdi");
  }
});

// STOP
bot.action("stop", async (ctx) => {
  await ctx.answerCbQuery();
  stopQuiz(ctx);
});

// ANSWER
bot.action(/answer_(\d+)/, async (ctx) => {
  await ctx.answerCbQuery();
  answerHandler(ctx);
});

// GLOBAL ERROR
bot.catch((err) => {
  console.log("BOT ERROR:", err);
});

bot.launch();
console.log("BOT RUNNING");
