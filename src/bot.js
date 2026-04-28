import { Telegraf } from "telegraf";
import dotenv from "dotenv";
import { startQuiz, stopQuiz, answerHandler } from "./handlers/quiz.handler.js";

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);

const menu = {
  reply_markup: {
    inline_keyboard: [
      [{ text: "🚀 START TEST", callback_data: "start" }],
      [{ text: "⛔ STOP TEST", callback_data: "stop" }],
    ],
  },
};

/* ================= START ================= */
bot.start((ctx) => {
  return ctx.reply("🎯 SMART QUIZ BOT", menu);
});

/* ================= START QUIZ ================= */
bot.action("start", async (ctx) => {
  await ctx.answerCbQuery();
  startQuiz(ctx, bot);
});

/* ================= STOP QUIZ ================= */
bot.action("stop", async (ctx) => {
  await ctx.answerCbQuery();
  stopQuiz(ctx.from.id);
  return ctx.reply("⛔ Test to‘xtadi", menu);
});

/* ================= ANSWER ================= */
bot.action(/ans_(\d+)/, async (ctx) => {
  await ctx.answerCbQuery();
  answerHandler(ctx, bot);
});

bot.launch();
console.log("🤖 QUIZ BOT READY");
