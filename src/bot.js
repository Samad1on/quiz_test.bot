import { Telegraf } from "telegraf";
import dotenv from "dotenv";

import { initUser, sendQuestion, stopQuiz, answerHandler } from "./quiz.js";

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);

/* ================= START ================= */
bot.start((ctx) => {
  initUser(ctx.from.id);
  ctx.reply("🎯 Quiz Bot Ready\n/start bosib testni boshlang");
  sendQuestion(ctx, bot);
});

/* ================= STOP ================= */
bot.action("stop", (ctx) => stopQuiz(ctx));

/* ================= ANSWER ================= */
bot.action(/ans_(\d+)/, (ctx) => answerHandler(ctx, bot));

bot.launch();

console.log("🤖 BOT STARTED");
