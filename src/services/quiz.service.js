import { parseQuestions } from "../parser.js";

const questions = parseQuestions();

const users = {};
const timers = {};

// ================= INIT =================
export function initUser(id) {
  if (!users[id]) {
    users[id] = {
      score: 0,
      active: false,
      current: null,
      used: [],
    };
  }
}

// ================= GET QUESTION =================
function getQuestion(user) {
  const available = questions.filter((q) => !user.used.includes(q.id));

  if (available.length === 0) return null;

  return available[Math.floor(Math.random() * available.length)];
}

// ================= CLEAR TIMER =================
function clearTimer(id) {
  if (timers[id]) {
    clearTimeout(timers[id]);
    delete timers[id];
  }
}

// ================= SEND QUESTION =================
export async function sendQuestion(ctx) {
  const id = ctx.from.id;
  const user = users[id];

  if (!user || !user.active) return;

  const q = getQuestion(user);

  if (!q) {
    return stopQuiz(ctx, true);
  }

  user.current = q;

  await ctx.reply(`❓ ${q.question}`, {
    reply_markup: {
      inline_keyboard: [
        ...q.answers.map((a, i) => [{ text: a, callback_data: `ans_${i}` }]),
        [{ text: "⛔ STOP", callback_data: "stop" }],
      ],
    },
  });

  clearTimer(id);

  timers[id] = setTimeout(() => {
    if (!users[id]?.active) return;

    users[id].used.push(q.id);

    ctx.telegram.sendMessage(ctx.chat.id, "⏰ Vaqt tugadi!");

    sendQuestion(ctx);
  }, 30000);
}

// ================= START =================
export function startQuiz(ctx) {
  const id = ctx.from.id;

  initUser(id);

  users[id].active = true;
  users[id].score = 0;
  users[id].used = [];
  users[id].current = null;

  sendQuestion(ctx);
}

// ================= ANSWER =================
export function answerHandler(ctx) {
  const id = ctx.from.id;
  const user = users[id];

  if (!user?.active || !user.current) return;

  const ans = Number(ctx.match[1]);
  const q = user.current;

  clearTimer(id);

  if (ans === q.correct) {
    user.score += 10;
    ctx.reply(`✅ To‘g‘ri | Ball: ${user.score}`);
  } else {
    ctx.reply(`❌ Noto‘g‘ri | Ball: ${user.score}`);
  }

  user.used.push(q.id);
  user.current = null;

  setTimeout(() => sendQuestion(ctx), 500);
}

// ================= STOP =================
export function stopQuiz(ctx, finished = false) {
  const id = ctx.from.id;

  clearTimer(id);

  if (users[id]) {
    users[id].active = false;
    users[id].current = null;
  }

  ctx.reply(
    finished
      ? `🎉 HAMMA SAVOLLAR TUGADI\nBall: ${users[id].score}`
      : `⛔ Quiz STOP qilindi\nBall: ${users[id].score}`,
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: "🚀 Qayta boshlash", callback_data: "start" }],
        ],
      },
    },
  );
}

export { users };
