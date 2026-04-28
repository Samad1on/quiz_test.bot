// ================= DATA =================
const users = {};
const timers = {};

// ================= QUESTIONS =================
export const questions = Array.from({ length: 491 }, (_, i) => ({
  id: i,
  question: `${i + 1}-savol: Ot nima?`,
  answers: ["So‘z turi", "Gap", "Tovush", "Raqam"],
  correct: 0,
}));

// ================= INIT USER =================
export function initUser(id) {
  if (!users[id]) {
    users[id] = {
      used: [],
      score: 0,
      active: false,
      current: null, // 🔥 MUHIM
    };
  }
}

// ================= RANDOM QUESTION =================
export function getRandomQuestion(id) {
  const user = users[id];

  let available = questions.filter((q) => !user.used.includes(q.id));

  if (available.length === 0) {
    user.used = [];
    available = questions;
  }

  const q = available[Math.floor(Math.random() * available.length)];

  user.used.push(q.id);
  user.current = q.id; // 🔥 MUHIM

  return q;
}

// ================= CLEAR TIMER =================
function clearUserTimer(id) {
  if (timers[id]) {
    clearTimeout(timers[id]);
    delete timers[id];
  }
}

// ================= SEND QUESTION =================
export async function sendQuestion(ctx, bot) {
  const id = ctx.from.id;
  const user = users[id];

  if (!user || !user.active) return;

  const q = getRandomQuestion(id);

  const buttons = q.answers.map((a, i) => [
    { text: a, callback_data: `ans_${i}` },
  ]);

  buttons.push([{ text: "⛔ STOP TEST", callback_data: "stop" }]);

  await ctx.reply(`❓ ${q.question}\n\n⏳ 30 sekund`, {
    reply_markup: { inline_keyboard: buttons },
  });

  clearUserTimer(id);

  timers[id] = setTimeout(() => {
    ctx.telegram.sendMessage(ctx.chat.id, "⏰ Vaqt tugadi!");
    sendQuestion(ctx, bot);
  }, 30000);
}

// ================= START QUIZ =================
export function startQuiz(ctx, bot) {
  const id = ctx.from.id;

  initUser(id);

  users[id].active = true;
  users[id].score = 0;
  users[id].used = [];
  users[id].current = null;

  sendQuestion(ctx, bot);
}

// ================= STOP QUIZ =================
export function stopQuiz(ctx) {
  const id = ctx.from.id;

  clearUserTimer(id);

  if (users[id]) {
    users[id].active = false;
    users[id].used = [];
    users[id].score = 0;
    users[id].current = null;
  }

  ctx.reply("⛔ Test to‘xtadi");
}

// ================= ANSWER HANDLER =================
export function answerHandler(ctx, bot) {
  const id = ctx.from.id;
  const user = users[id];

  if (!user || !user.active) return;

  clearUserTimer(id);

  const ans = Number(ctx.match[1]);

  const q = questions.find((x) => x.id === user.current);

  if (!q) return;

  if (ans === q.correct) {
    user.score += 10;
    ctx.reply(`✅ To‘g‘ri | Ball: ${user.score}`);
  } else {
    ctx.reply(`❌ Noto‘g‘ri | Ball: ${user.score}`);
  }

  setTimeout(() => sendQuestion(ctx, bot), 700);
}

// ================= EXPORTS =================
export { users, timers };
