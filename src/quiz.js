import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ================= LOAD QUESTIONS ================= */
const text = fs.readFileSync(
  path.join(__dirname, "../data/questions.txt"),
  "utf-8",
);

/* ================= PARSER ================= */
function parse(text) {
  const blocks = text
    .split("++++")
    .map((b) => b.trim())
    .filter(Boolean);

  return blocks.map((block, i) => {
    const lines = block
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    const question = lines.find((l) => !l.startsWith("#"));
    const answers = lines
      .filter((l) => l.startsWith("#"))
      .map((l) => l.replace("#", "").trim());

    return {
      id: i,
      question,
      answers,
      correct: 0,
    };
  });
}

export const questions = parse(text);

/* ================= STATE ================= */
const users = {};
const timers = {};

/* ================= INIT ================= */
export function initUser(id) {
  if (!users[id]) {
    users[id] = {
      used: new Set(),
      score: 0,
      active: true,
    };
  }
}

/* ================= RANDOM QUESTION ================= */
function getRandom(id) {
  const user = users[id];

  let available = questions.filter((q) => !user.used.has(q.id));

  if (available.length === 0) {
    user.used.clear();
    available = questions;
  }

  const q = available[Math.floor(Math.random() * available.length)];

  user.used.add(q.id);

  return q;
}

/* ================= SEND QUESTION ================= */
export async function sendQuestion(ctx, bot) {
  const id = ctx.from.id;
  const user = users[id];

  if (!user || !user.active) return;

  const q = getRandom(id);

  const buttons = q.answers.map((a, i) => [
    { text: a, callback_data: `ans_${i}` },
  ]);

  buttons.push([{ text: "⛔ STOP TEST", callback_data: "stop" }]);

  await ctx.reply(
    `❓ ${q.question}

⏳ 30 sekund`,
    {
      reply_markup: { inline_keyboard: buttons },
    },
  );

  if (timers[id]) clearTimeout(timers[id]);

  timers[id] = setTimeout(() => {
    if (!users[id]?.active) return;

    ctx.telegram.sendMessage(ctx.chat.id, "⏰ Vaqt tugadi!");
    sendQuestion(ctx, bot);
  }, 30000);
}

/* ================= STOP ================= */
export function stopQuiz(ctx) {
  const id = ctx.from.id;

  if (timers[id]) clearTimeout(timers[id]);

  if (users[id]) {
    users[id].active = false;
    users[id].used.clear();
    users[id].score = 0;
  }

  ctx.reply("⛔ Test to‘xtadi");
}

/* ================= ANSWER ================= */
export function answerHandler(ctx, bot) {
  const id = ctx.from.id;
  const user = users[id];

  if (!user || !user.active) return;

  const last = [...user.used].pop();
  const q = questions.find((x) => x.id === last);

  const ans = Number(ctx.match[1]);

  if (ans === q.correct) {
    user.score += 10;
    ctx.reply(`✅ To‘g‘ri | Ball: ${user.score}`);
  } else {
    ctx.reply(`❌ Noto‘g‘ri | Ball: ${user.score}`);
  }

  if (timers[id]) clearTimeout(timers[id]);

  setTimeout(() => sendQuestion(ctx, bot), 800);
}
