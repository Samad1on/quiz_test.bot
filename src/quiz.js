import { parseQuestions } from "./parser.js";

// 🔥 TXT dan o‘qiladigan questions
const questions = parseQuestions("./data/questions.txt");

// ================= USERS =================
const users = new Map();

// ================= INIT =================
export function initUser(ctx) {
  users.set(ctx.from.id, {
    score: 0,
    used: [],
    current: null,
  });
}

// ================= RANDOM QUESTION =================
function getRandomQuestion(user) {
  const available = questions.filter((q) => !user.used.includes(q.id));

  if (available.length === 0) return null;

  return available[Math.floor(Math.random() * available.length)];
}

// ================= SEND QUESTION =================
export function startQuiz(ctx) {
  const user = users.get(ctx.from.id);

  if (!user) return;

  const q = getRandomQuestion(user);

  if (!q) {
    return ctx.reply(`🎉 Test tugadi!\nBall: ${user.score}`);
  }

  user.current = q;

  ctx.reply(`❓ ${q.question}`, {
    reply_markup: {
      inline_keyboard: q.answers.map((text, i) => [
        { text, callback_data: `ans_${i}` },
      ]),
    },
  });
}

// ================= ANSWER =================
export function answerHandler(ctx, bot, answerIndex) {
  const user = users.get(ctx.from.id);

  if (!user || !user.current) return;

  const q = user.current;

  const isCorrect = Number(answerIndex) === q.correct;

  if (isCorrect) {
    user.score += 10;
    ctx.reply(`✅ To‘g‘ri! | Ball: ${user.score}`);
  } else {
    ctx.reply(`❌ Noto‘g‘ri! | Ball: ${user.score}`);
  }

  user.used.push(q.id);
  user.current = null;

  setTimeout(() => {
    startQuiz(ctx, bot);
  }, 800);
}

// ================= STOP =================
export function stopQuiz(ctx) {
  const user = users.get(ctx.from.id);

  if (!user) return;

  ctx.reply(`🛑 Test to‘xtadi\nFinal Ball: ${user.score}`);

  users.delete(ctx.from.id);
}
