import { Telegraf } from "telegraf";
import dotenv from "dotenv";

import {
  initQuiz,
  getRandomQuestion,
  handleAnswer,
  resetUser,
  stopQuiz,
} from "./handlers/quiz.handler.js";

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);

const timers = {};

/* =========================
   START
========================= */
bot.start(async (ctx) => {
  await resetUser(ctx.from.id);

  return ctx.reply("🚀 Infinite Quiz", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "▶ START", callback_data: "begin_quiz" }],
        [{ text: "⛔ STOP", callback_data: "stop_quiz" }],
      ],
    },
  });
});

/* =========================
   STOP
========================= */
bot.action("stop_quiz", async (ctx) => {
  await ctx.answerCbQuery();

  stopQuiz(ctx.from.id);

  if (timers[ctx.from.id]) {
    clearTimeout(timers[ctx.from.id]);
  }

  return ctx.reply("⛔ Test to‘xtadi");
});

/* =========================
   START QUIZ
========================= */
bot.action("begin_quiz", async (ctx) => {
  await ctx.answerCbQuery();

  await resetUser(ctx.from.id);

  sendQuestion(ctx);
});

/* =========================
   SEND QUESTION (INFINITE)
========================= */
async function sendQuestion(ctx) {
  const userId = ctx.from.id;

  const q = await getRandomQuestion(userId);

  if (!q) return;

  const buttons = q.answers.map((a, i) => [
    { text: a, callback_data: `answer_${i}` },
  ]);

  await ctx.reply(
    `❓ ${q.question}

⏳ 30 sekund`,
    {
      reply_markup: {
        inline_keyboard: buttons,
      },
    },
  );

  if (timers[userId]) {
    clearTimeout(timers[userId]);
  }

  timers[userId] = setTimeout(() => {
    ctx.telegram.sendMessage(ctx.chat.id, "⏰ Vaqt tugadi!");
    sendQuestion(ctx);
  }, 30000);
}

/* =========================
   ANSWER
========================= */
bot.action(/answer_(\d+)/, async (ctx) => {
  const userId = ctx.from.id;
  const index = Number(ctx.match[1]);

  await ctx.answerCbQuery();

  if (timers[userId]) {
    clearTimeout(timers[userId]);
  }

  const res = await handleAnswer(userId, index);

  await ctx.reply(res);

  setTimeout(() => {
    sendQuestion(ctx);
  }, 500);
});

/* =========================
   INIT
========================= */
(async () => {
  await initQuiz();

  bot.launch();

  console.log("🤖 Infinite Quiz Bot started");
})();
