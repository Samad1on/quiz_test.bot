import { loadQuestions } from "../loeder.js";
import { quizKeyboard } from "../keyboards/quiz.keyboard.js";

const questions = loadQuestions();

// ================= USER STATE =================
const users = {};
const timers = {};

// ================= INIT =================
export function initUser(id) {
  if (!users[id]) {
    users[id] = {
      score: 0,
      active: false,
      current: null,
    };
  }
}

// ================= RANDOM QUESTION =================
function getRandomQuestion() {
  return questions[Math.floor(Math.random() * questions.length)];
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

  const q = getRandomQuestion();
  user.current = q;

  await ctx.reply(`❓ ${q.question}\n\n⏳ 30 sekund`, quizKeyboard(q.answers));

  clearTimer(id);

  timers[id] = setTimeout(() => {
    if (!users[id]?.active) return;

    ctx.telegram.sendMessage(ctx.chat.id, "⏰ Vaqt tugadi!");
    sendQuestion(ctx);
  }, 30000);
}

// ================= START QUIZ =================
export function startQuiz(ctx) {
  const id = ctx.from.id;

  initUser(id);

  users[id].active = true;
  users[id].score = 0;

  sendQuestion(ctx);
}

// ================= STOP QUIZ =================
export function stopQuiz(ctx) {
  const id = ctx.from.id;

  clearTimer(id);

  if (users[id]) {
    users[id].active = false;
    users[id].score = 0;
    users[id].current = null;
  }

  ctx.reply("⛔ Test to‘xtadi");
}

// ================= ANSWER =================
export function answerHandler(ctx) {
  const id = ctx.from.id;
  const user = users[id];

  if (!user || !user.active) return;

  clearTimer(id);

  const answer = Number(ctx.match[1]);
  const q = user.current;

  if (!q) return;

  if (answer === q.correct) {
    user.score += 10;
    ctx.reply(`✅ To‘g‘ri! | Ball: ${user.score}`);
  } else {
    ctx.reply(`❌ Noto‘g‘ri | Ball: ${user.score}`);
  }

  setTimeout(() => sendQuestion(ctx), 800);
}

// ================= EXPORTS =================
export { users, timers };
