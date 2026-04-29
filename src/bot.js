import { Telegraf } from "telegraf";
import dotenv from "dotenv";

import { initUser, startQuiz, stopQuiz, handlePollAnswer } from "./quiz.js";

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);

// ================= START =================
bot.start(async (ctx) => {
  initUser(ctx.chat.id);

  await ctx.reply(
    "🎯 Smart Quiz Bot\n\nQuizni boshlash uchun tugmani bosing 👇",
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "🚀 Testni boshlash",
              callback_data: "start",
            },
          ],
        ],
      },
    },
  );
});

// ================= START =================
bot.action("start", async (ctx) => {
  await ctx.answerCbQuery();

  startQuiz(ctx);
});

// ================= STOP =================
bot.action("stop", async (ctx) => {
  await ctx.answerCbQuery();

  stopQuiz(ctx);
});

// ================= POLL ANSWER =================
bot.on("poll_answer", async (ctx) => {
  await handlePollAnswer(bot, ctx.update.poll_answer);
});

// ================= ERROR =================
bot.catch((err) => {
  console.log("BOT ERROR:", err.message);
});

// ================= LAUNCH =================
bot.launch();

console.log("🤖 Bot running...");
