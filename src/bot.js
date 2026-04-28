import { Telegraf } from "telegraf";
import dotenv from "dotenv";

import {
  initQuiz,
  getNextQuestion,
  handleAnswer,
  resetUser,
  stopQuiz,
} from "./handlers/quiz.handler.js";

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);

/* =========================
   USER TIMERS (MUHIM)
========================= */
const timers = {};

/* =========================
   START
========================= */
bot.start(async (ctx) => {
  await resetUser(ctx.from.id);

  return ctx.reply("🚀 Testni boshlash:", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "▶ START", callback_data: "begin_quiz" }],
        [{ text: "⛔ STOP TEST", callback_data: "stop_quiz" }],
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

  return ctx.reply("⛔ Test to‘xtatildi");
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
   SEND QUESTION (FIXED)
========================= */
async function sendQuestion(ctx) {
  const q = await getNextQuestion(ctx.from.id);

  if (!q) {
    return ctx.reply("🏁 Test tugadi");
  }

  const userId = ctx.from.id;

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

  // ❗ OLD TIMER CLEAR
  if (timers[userId]) {
    clearTimeout(timers[userId]);
  }

  // ⏰ NEW TIMER
  timers[userId] = setTimeout(() => {
    ctx.telegram.sendMessage(ctx.chat.id, "⏰ Vaqt tugadi!");

    sendQuestion(ctx); // next question
  }, 30000);
}

/* =========================
   ANSWER
========================= */
bot.action(/answer_(\d+)/, async (ctx) => {
  const index = Number(ctx.match[1]);

  await ctx.answerCbQuery();

  const userId = ctx.from.id;

  if (timers[userId]) {
    clearTimeout(timers[userId]); // ❗ timer stop
  }

  const res = await handleAnswer(userId, index);

  await ctx.reply(res);

  setTimeout(() => {
    sendQuestion(ctx);
  }, 800);
});

/* =========================
   INIT
========================= */
(async () => {
  await initQuiz();

  bot.launch();

  console.log("🤖 PRO Quiz Bot started");
})();
