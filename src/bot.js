import { Telegraf } from "telegraf";
import dotenv from "dotenv";

import { initUser, startQuiz, stopQuiz, answerHandler } from "./quiz.js";

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);

// ================= START =================
bot.start(async (ctx) => {
  await ctx.reply("🎯 Quiz Bot Ready\n/start bosib testni boshlang");
});

// ================= START TEST =================
bot.action("start_test", async (ctx) => {
  await ctx.answerCbQuery();
  startQuiz(ctx, bot);
});

// ================= STOP TEST =================
bot.action("stop", async (ctx) => {
  await ctx.answerCbQuery();
  stopQuiz(ctx);
});

// ================= ANSWER =================
bot.action(/ans_(\d+)/, async (ctx) => {
  await ctx.answerCbQuery();
  answerHandler(ctx, bot);
});

// ================= LAUNCH =================
bot.launch();

console.log("🤖 Bot started");
