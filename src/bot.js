import { Telegraf } from "telegraf";
import dotenv from "dotenv";

import {
  initQuiz,
  getNextQuestion,
  handleAnswer,
  resetUser,
  getScore,
} from "./handlers/quiz.handler.js";

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);

/* =========================
   START
========================= */
bot.start(async (ctx) => {
  await resetUser(ctx.from.id);

  return ctx.reply(
    `❓ TEST BOT

👉 Boshlash uchun START bosing`,
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: "🚀 START TEST", callback_data: "begin_quiz" }],
        ],
      },
    },
  );
});

/* =========================
   START QUIZ
========================= */
bot.action("begin_quiz", async (ctx) => {
  await ctx.answerCbQuery();

  await ctx.reply("📘 Test boshlandi!");

  sendQuestion(ctx);
});

/* =========================
   SEND QUESTION
========================= */
async function sendQuestion(ctx) {
  const q = await getNextQuestion(ctx.from.id);

  if (!q) {
    const score = getScore(ctx.from.id);

    return ctx.reply(
      `🏁 TEST TUGADI

📊 Natija:
✔ To‘g‘ri javoblar: ${score.correct}
❌ Xatolar: ${score.wrong}
⭐ Ball: ${score.score}`,
    );
  }

  const buttons = q.answers.map((a, i) => [
    { text: a, callback_data: `answer_${i}` },
  ]);

  ctx.reply(
    `❓ ${q.question}

⏳ 30 sekund`,
    {
      reply_markup: {
        inline_keyboard: buttons,
      },
    },
  );

  // 30 sekund timer
  setTimeout(() => {
    ctx.telegram.sendMessage(ctx.chat.id, "⏰ Vaqt tugadi!");
    sendQuestion(ctx);
  }, 30000);
}

/* =========================
   ANSWER HANDLER
========================= */
bot.action(/answer_(\d+)/, async (ctx) => {
  const index = Number(ctx.match[1]);

  await ctx.answerCbQuery();

  const result = await handleAnswer(ctx.from.id, index);

  await ctx.reply(result);

  setTimeout(() => {
    sendQuestion(ctx);
  }, 1000);
});

/* =========================
   INIT
========================= */
(async () => {
  await initQuiz();

  bot.launch();

  console.log("🤖 PRO Quiz Bot started");
})();
