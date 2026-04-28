import { Telegraf } from "telegraf";
import dotenv from "dotenv";
import { questions, users, timers } from "./quiz.js";

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);

/* ================= MENU ================= */
function menu() {
  return {
    reply_markup: {
      inline_keyboard: [
        [{ text: "🚀 START TEST", callback_data: "start" }],
        [{ text: "⛔ STOP TEST", callback_data: "stop" }],
      ],
    },
  };
}

/* ================= USER INIT ================= */
function initUser(id) {
  users[id] = {
    used: [],
    score: 0,
    active: false,
  };
}

/* ================= RANDOM QUESTION ================= */
function getQuestion(userId) {
  const user = users[userId];

  const available = questions.filter((q) => !user.used.includes(q.id));

  if (available.length === 0) {
    user.used = [];
    return getQuestion(userId);
  }

  const q = available[Math.floor(Math.random() * available.length)];
  user.used.push(q.id);

  return q;
}

/* ================= SEND QUESTION ================= */
async function sendQuestion(ctx) {
  const id = ctx.from.id;
  const user = users[id];

  if (!user || !user.active) return;

  const q = getQuestion(id);

  const buttons = q.answers.map((a, i) => [
    { text: a, callback_data: `ans_${i}` },
  ]);

  buttons.push([{ text: "⛔ STOP", callback_data: "stop" }]);

  await ctx.reply(
    `❓ ${q.question}

⏳ 30 sekund`,
    {
      reply_markup: { inline_keyboard: buttons },
    },
  );

  if (timers[id]) clearTimeout(timers[id]);

  timers[id] = setTimeout(() => {
    ctx.telegram.sendMessage(ctx.chat.id, "⏰ Vaqt tugadi!");
    sendQuestion(ctx);
  }, 30000);
}

/* ================= START ================= */
bot.start(async (ctx) => {
  const id = ctx.from.id;
  initUser(id);
  ctx.reply("🎯 Quiz Bot", menu());
});

/* ================= START TEST ================= */
bot.action("start", async (ctx) => {
  const id = ctx.from.id;
  initUser(id);
  users[id].active = true;

  ctx.answerCbQuery();
  sendQuestion(ctx);
});

/* ================= STOP ================= */
bot.action("stop", async (ctx) => {
  const id = ctx.from.id;

  if (timers[id]) clearTimeout(timers[id]);

  initUser(id);

  ctx.answerCbQuery();
  ctx.reply("⛔ Test to‘xtadi", menu());
});

/* ================= ANSWER ================= */
bot.action(/ans_(\d+)/, async (ctx) => {
  const id = ctx.from.id;
  const user = users[id];

  ctx.answerCbQuery();

  const q = user.used[user.used.length - 1];
  const question = questions.find((x) => x.id === q);

  const ans = Number(ctx.match[1]);

  if (ans === question.correct) {
    user.score += 10;
    await ctx.reply(`✅ To‘g‘ri | Ball: ${user.score}`);
  } else {
    await ctx.reply(`❌ Xato | Ball: ${user.score}`);
  }

  setTimeout(() => sendQuestion(ctx), 800);
});

/* ================= LAUNCH ================= */
bot.launch();
console.log("🤖 Quiz Bot READY");
