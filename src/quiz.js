import { parseQuestions } from "./parser.js";

const questions = parseQuestions();

const users = new Map();
const timers = new Map();

// ================= INIT =================
export function initUser(ctx) {
  users.set(ctx.from.id, {
    score: 0,
    used: [],
    current: null,
    active: false,
  });
}

// ================= GET QUESTION =================
function getQuestion(user) {
  const available = questions.filter((q) => !user.used.includes(q.id));

  if (available.length === 0) return null;

  return available[Math.floor(Math.random() * available.length)];
}

// ================= CLEAR TIMER =================
function clearTimer(id) {
  if (timers.has(id)) {
    clearTimeout(timers.get(id));
    timers.delete(id);
  }
}

// ================= SEND QUESTION =================
export function sendQuestion(ctx) {
  const user = users.get(ctx.from.id);
  if (!user || !user.active) return;

  const q = getQuestion(user);

  if (!q) {
    user.active = false;
    return ctx.reply(`🎉 Test tugadi!\nBall: ${user.score}`);
  }

  user.current = q;

  ctx.reply(`❓ ${q.question}\n⏳ 30 sekund`, {
    reply_markup: {
      inline_keyboard: [
        ...q.answers.map((a, i) => [{ text: a, callback_data: `ans_${i}` }]),
        [{ text: "⛔ STOP", callback_data: "stop" }],
      ],
    },
  });

  // ================= TIMER 30s =================
  clearTimer(ctx.from.id);

  const timer = setTimeout(() => {
    const u = users.get(ctx.from.id);

    if (!u || !u.active) return;

    ctx.telegram.sendMessage(ctx.chat.id, "⏰ Vaqt tugadi!");

    u.used.push(q.id);

    sendQuestion(ctx);
  }, 30000);

  timers.set(ctx.from.id, timer);
}

// ================= START =================
export function startQuiz(ctx) {
  const user = users.get(ctx.from.id);
  if (!user) return;

  user.active = true;
  user.used = [];
  user.score = 0;

  sendQuestion(ctx);
}

// ================= ANSWER =================
export function answerHandler(ctx) {
  const user = users.get(ctx.from.id);
  if (!user || !user.current) return;

  const ans = Number(ctx.match[1]);
  const q = user.current;

  clearTimer(ctx.from.id);

  if (ans === q.correct) {
    user.score += 10;
    ctx.reply(`✅ To‘g‘ri | Ball: ${user.score}`);
  } else {
    ctx.reply(`❌ Noto‘g‘ri | Ball: ${user.score}`);
  }

  user.used.push(q.id);
  user.current = null;

  setTimeout(() => sendQuestion(ctx), 700);
}

// ================= STOP =================
export function stopQuiz(ctx) {
  const user = users.get(ctx.from.id);
  if (!user) return;

  clearTimer(ctx.from.id);

  user.active = false;

  ctx.reply(`🛑 STOP\nFinal Ball: ${user.score}`, {
    reply_markup: {
      inline_keyboard: [[{ text: "🚀 Restart", callback_data: "start" }]],
    },
  });
}
