import { Telegraf } from "telegraf";
import dotenv from "dotenv";

import { initQuiz, startQuiz, handleAnswer } from "./handlers/quiz.handler.js";

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);
console.log("BOT TOKEN:", process.env.BOT_TOKEN);
(async () => {
  await bot.telegram.deleteWebhook();

  await initQuiz();

  bot.start((ctx) => startQuiz(ctx));

  bot.action(/answer_(\d+)/, async (ctx) => {
    const index = Number(ctx.match[1]);
    await ctx.answerCbQuery();
    handleAnswer(ctx, index);
  });

  bot.launch();

  console.log("🤖 Bot started");
})();
