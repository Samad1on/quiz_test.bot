import { Telegraf } from "telegraf";
import dotenv from "dotenv";

import { startQuiz, stopQuiz, answerHandler } from "./quiz.js";

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);

/* ================= START MENU ================= */
bot.start((ctx) => {
  ctx.reply(
    `🎯 Quiz Bot Ready

Testni boshlash uchun START tugmasini bosing 👇`,
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: "🚀 START TEST", callback_data: "start_test" }],
          [{ text: "⛔ STOP TEST", callback_data: "stop" }],
        ],
      },
    },
  );
});

/* ================= START TEST ================= */
bot.action("start_test", (ctx) => {
  startQuiz(ctx, bot);
});

/* ================= STOP ================= */
bot.action("stop", (ctx) => {
  stopQuiz(ctx);
});

/* ================= ANSWER ================= */
bot.action(/ans_(\d+)/, (ctx) => {
  answerHandler(ctx, bot);
});

/* ================= LAUNCH ================= */
bot.launch();

console.log("🤖 Quiz Bot Running");
