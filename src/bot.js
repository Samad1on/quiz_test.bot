import { Telegraf } from "telegraf";
import dotenv from "dotenv";

import { startQuiz, stopQuiz, answerHandler } from "./quiz.js";

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);

/* ================= START ================= */
bot.start((ctx) => {
  ctx.reply("🎯 Quiz Bot Ready\n/start bosib testni boshlang");
});

/* ================= CALLBACKS ================= */
bot.action("start_test", (ctx) => {
  startQuiz(ctx, bot);
});

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
