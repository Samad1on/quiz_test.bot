import { questions } from "./questions.js";

const users = new Map();

// ================= INIT =================
export function initUser(ctx) {
  users.set(ctx.from.id, {
    index: 0,
    score: 0,
    used: [],
  });
}

// ================= RANDOM QUESTION =================
function getRandomQuestion(user) {
  const available = questions.filter((q) => !user.used.includes(q.id));

  if (available.length === 0) return null;

  const random = available[Math.floor(Math.random() * available.length)];
  return random;
}

// ================= START QUIZ =================
export function startQuiz(ctx) {
  const user = users.get(ctx.from.id);

  const q = getRandomQuestion(user);

  if (!q) {
    return ctx.reply(`🎉 Test tugadi! Ball: ${user.score}`);
  }

  user.current = q;

  ctx.reply(`❓ ${q.q}\n\n⏳ 30 sekund`, {
    reply_markup: {
      inline_keyboard: q.a.map((text, i) => [
        { text, callback_data: `ans_${i}` },
      ]),
    },
  });
}

// ================= ANSWER =================
export function answerHandler(ctx, bot, answerIndex) {
  const user = users.get(ctx.from.id);
  const q = user.current;

  if (!q) return;

  const correct = q.correct;

  if (Number(answerIndex) === correct) {
    user.score += 10;
    ctx.reply(`✅ To‘g‘ri | Ball: ${user.score}`);
  } else {
    ctx.reply(`❌ Noto‘g‘ri | Ball: ${user.score}`);
  }

  user.used.push(q.id);

  setTimeout(() => {
    startQuiz(ctx, bot);
  }, 1000);
}

// ================= STOP =================
export function stopQuiz(ctx) {
  const user = users.get(ctx.from.id);

  ctx.reply(`🛑 Stop | Final Ball: ${user?.score || 0}`);

  users.delete(ctx.from.id);
}
