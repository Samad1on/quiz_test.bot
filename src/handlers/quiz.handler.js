const users = {};
const timers = {};

/* ================= QUESTIONS ================= */
const questions = Array.from({ length: 491 }, (_, i) => ({
  id: i,
  question: `${i + 1}-savol: Ot nima?`,
  answers: ["So‘z turi", "Gap", "Tovush", "Raqam"],
  correct: 0,
}));

/* ================= INIT USER ================= */
function initUser(userId) {
  if (!users[userId]) {
    users[userId] = {
      used: [],
      score: 0,
      active: false,
    };
  }
}

/* ================= RANDOM QUESTION ================= */
function getRandom(userId) {
  const user = users[userId];

  let available = questions.filter((q) => !user.used.includes(q.id));

  if (available.length === 0) {
    user.used = [];
    available = questions;
  }

  const q = available[Math.floor(Math.random() * available.length)];

  user.used.push(q.id);

  return q;
}

/* ================= SEND QUESTION ================= */
async function sendQuestion(ctx, bot) {
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
    { reply_markup: { inline_keyboard: buttons } },
  );

  if (timers[id]) clearTimeout(timers[id]);

  timers[id] = setTimeout(() => {
    if (!users[id]?.active) return;

    bot.telegram.sendMessage(ctx.chat.id, "⏰ Vaqt tugadi!");
    sendQuestion(ctx, bot);
  }, 30000);
}

/* ================= START ================= */
export function startQuiz(ctx, bot) {
  const id = ctx.from.id;

  initUser(id);
  users[id].active = true;

  sendQuestion(ctx, bot);
}

/* ================= STOP ================= */
export function stopQuiz(ctx, bot) {
  const id = ctx.from.id;

  if (timers[id]) clearTimeout(timers[id]);

  if (users[id]) {
    users[id].active = false;
    users[id].used = [];
    users[id].score = 0;
  }

  ctx.reply("⛔ Test to‘xtadi");
}

/* ================= ANSWER ================= */
export function answerHandler(ctx, bot) {
  const id = ctx.from.id;
  const user = users[id];

  if (!user || !user.active) return;

  const last = user.used[user.used.length - 1];
  const q = questions.find((x) => x.id === last);

  if (!q) return;

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

export { users, timers };
