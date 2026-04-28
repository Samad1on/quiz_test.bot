import { Telegraf } from "telegraf";
import dotenv from "dotenv";
import {
  startQuiz,
  stopQuiz,
  answerHandler,
  initUser,
} from "./handlers/quiz.handler";

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);

// ================= START =================
bot.start((ctx) => {
  initUser(ctx.from.id);

  ctx.reply("🎯 Quiz Bot Ready", {
    reply_markup: {
      inline_keyboard: [[{ text: "🚀 Boshlash", callback_data: "start" }]],
    },
  });
});

// ================= DEBUG =================
bot.on("callback_query", (ctx) => {
  console.log("CLICK:", ctx.callbackQuery.data);
});

// ================= START QUIZ =================
bot.action("start", async (ctx) => {
  await ctx.answerCbQuery();
  startQuiz(ctx);
});

// ================= STOP =================
bot.action("stop", async (ctx) => {
  await ctx.answerCbQuery();
  stopQuiz(ctx);
});

// ================= ANSWER =================
bot.action(/answer_(\d+)/, async (ctx) => {
  await ctx.answerCbQuery();
  answerHandler(ctx);
});

bot.launch();

console.log("🤖 Bot ishlayapti...");
