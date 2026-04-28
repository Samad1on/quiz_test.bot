const users = {};
const timers = {};

// ================= QUESTIONS =================
const questions = [
  {
    id: 1,
    question: "Ot nima?",
    answers: ["So‘z turi", "Gap", "Tovush", "Raqam"],
    correct: 0,
  },
  {
    id: 2,
    question: "2+2=?",
    answers: ["3", "4", "5", "6"],
    correct: 1,
  },
];

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

  // 🔥 FINISH
  if (!q) {
    clearTimer(id);
    user.active = false;
    user.current = null;

    return ctx.reply(`🎉 Test tugadi!\nBall: ${user.score}`);
  }

  user.current = q;

  await ctx.reply(`❓ ${q.question}`, {
    reply_markup: {
      inline_keyboard: q.answers.map((a, i) => [
        { text: a, callback_data: `answer_${i}` },
      ]),
    },
  });

  // 🔥 TIMER RESET
  clearTimer(id);

  timers[id] = setTimeout(() => {
    if (!users[id] || !users[id].active) return;

    ctx.telegram.sendMessage(ctx.chat.id, "⏰ Vaqt tugadi!");

    // 🔥 avoid duplicate question bug
    if (users[id].current) {
      users[id].used.push(users[id].current.id);
    }

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

  sendQuestion(ctx).catch((err) => {
    console.log("SEND QUESTION ERROR:", err);
  });
}

// ================= STOP =================
export function stopQuiz(ctx) {
  const id = ctx.from.id;

  clearTimer(id);

  if (users[id]) {
    users[id].active = false;
    users[id].current = null;
  }

  ctx.reply(`⛔ Test to‘xtadi\nBall: ${users[id]?.score || 0}`);
}

// ================= ANSWER =================
export function answerHandler(ctx) {
  const id = ctx.from.id;
  const user = users[id];

  if (!user || !user.active || !user.current) return;

  const ans = Number(ctx.match[1]);
  const q = user.current;

  // 🔥 IMPORTANT FIX
  clearTimer(id);

  const isCorrect = ans === q.correct;

  if (isCorrect) {
    user.score += 10;
    ctx.reply(`✅ To‘g‘ri! | Ball: ${user.score}`);
  } else {
    ctx.reply(`❌ Noto‘g‘ri! | Ball: ${user.score}`);
  }

  user.used.push(q.id);
  user.current = null;

  // 🔥 prevent overlap
  setTimeout(() => {
    sendQuestion(ctx);
  }, 500);
}

// ================= EXPORT =================
export { users, timers };
