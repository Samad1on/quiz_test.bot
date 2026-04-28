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
   MENU
========================= */
function mainMenu() {
  return {
    reply_markup: {
      inline_keyboard: [
        [{ text: "🚀 START TEST", callback_data: "begin_quiz" }],
        [{ text: "⛔ STOP TEST", callback_data: "stop_quiz" }],
      ],
    },
  };
}

/* =========================
   START
========================= */
bot.start(async (ctx) => {
  await resetUser(ctx.from.id);

  return ctx.reply("🎯 Quiz Bot", mainMenu());
});

/* =========================
   STOP (RESET + MENU)
========================= */
bot.action("stop_quiz", async (ctx) => {
  await ctx.answerCbQuery();

  const userId = ctx.from.id;

  stopQuiz(userId);

  if (timers[userId]) {
    clearTimeout(timers[userId]);
  }

  await resetUser(userId);

  return ctx.reply("⛔ Test to‘xtatildi", mainMenu());
});

/* =========================
   START QUIZ
========================= */
bot.action("begin_quiz", async (ctx) => {
  await ctx.answerCbQuery();

  const userId = ctx.from.id;

  await resetUser(userId);

  sendQuestion(ctx);
});

/* =========================
   SEND QUESTION (FIX RANDOM + NO REPEAT)
========================= */
async function sendQuestion(ctx) {
  const userId = ctx.from.id;

  const q = await getRandomQuestion(userId);

  if (!q) return ctx.reply("❌ Savol topilmadi");

  const buttons = q.answers.map((a, i) => [
    { text: a, callback_data: `answer_${i}` },
  ]);

  // ⚡ STOP BUTTON HAR DOIM
  buttons.push([{ text: "⛔ STOP TEST", callback_data: "stop_quiz" }]);

  await ctx.reply(
    `❓ ${q.question}

⏳ 30 sekund`,
    {
      reply_markup: {
        inline_keyboard: buttons,
      },
    },
  );

  if (timers[userId]) clearTimeout(timers[userId]);

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

  if (timers[userId]) clearTimeout(timers[userId]);

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

  console.log("🤖 FINAL Quiz Bot started");
})();
