const users = {};
const timers = {};

/* ================= 491 SAVOL ================= */
const questions = Array.from({ length: 491 }, (_, i) => ({
  id: i,
  question: `${i + 1}-savol: Ot nima?`,
  answers: ["So‘z turi", "Gap", "Tovush", "Raqam"],
  correct: 0,
}));

/* ================= USER INIT ================= */
function init(userId) {
  if (!users[userId]) {
    users[userId] = {
      used: [],
      score: 0,
      active: false,
    };
  }
}

/* ================= RANDOM ================= */
function getRandom(userId) {
  const user = users[userId];

  const available = questions.filter((q) => !user.used.includes(q.id));

  if (available.length === 0) {
    user.used = [];
    return getRandom(userId);
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

  // STOP HAR DOIM PASDA
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
    bot.telegram.sendMessage(ctx.chat.id, "⏰ Vaqt tugadi!");
    sendQuestion(ctx, bot);
  }, 30000);
}

/* ================= START QUIZ ================= */
export function startQuiz(ctx, bot) {
  const id = ctx.from.id;

  init(id);
  users[id].active = true;

  sendQuestion(ctx, bot);
}

/* ================= STOP QUIZ ================= */
export function stopQuiz(userId) {
  if (timers[userId]) clearTimeout(timers[userId]);

  if (users[userId]) {
    users[userId].active = false;
    users[userId].used = [];
    users[userId].score = 0;
  }
}

/* ================= ANSWER ================= */
export function answerHandler(ctx, bot) {
  const id = ctx.from.id;
  const user = users[id];

  const last = user.used[user.used.length - 1];
  const q = questions.find((x) => x.id === last);

  const ans = Number(ctx.match[1]);

  if (ans === q.correct) {
    user.score += 10;
    ctx.reply(`✅ To‘g‘ri | Ball: ${user.score}`);
  } else {
    ctx.reply(`❌ Noto‘g‘ri | Ball: ${user.score}`);
  }

  setTimeout(() => sendQuestion(ctx, bot), 800);
}
