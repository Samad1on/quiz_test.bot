const users = {};
const timers = {};

const questions = [
  {
    id: 1,
    question: "Ot nima?",
    answers: ["So‘z turi", "Gap", "Tovush", "Raqam"],
    correct: 0,
  },
];

export function initUser(id) {
  if (!users[id]) {
    users[id] = {
      score: 0,
      active: false,
      current: null,
    };
  }
}

function getQuestion() {
  return questions[Math.floor(Math.random() * questions.length)];
}

function clearTimer(id) {
  if (timers[id]) clearTimeout(timers[id]);
}

export async function sendQuestion(ctx) {
  const id = ctx.from.id;
  const user = users[id];

  if (!user || !user.active) return;

  const q = getQuestion();
  user.current = q;

  await ctx.reply(`❓ ${q.question}`, {
    reply_markup: {
      inline_keyboard: q.answers.map((a, i) => [
        { text: a, callback_data: `answer_${i}` },
      ]),
    },
  });

  clearTimer(id);

  timers[id] = setTimeout(() => {
    ctx.telegram.sendMessage(ctx.chat.id, "⏰ Vaqt tugadi!");
    sendQuestion(ctx);
  }, 30000);
}

export function startQuiz(ctx) {
  const id = ctx.from.id;

  initUser(id);

  users[id].active = true;
  users[id].score = 0;

  console.log("QUIZ START OK");

  sendQuestion(ctx).catch((err) => {
    console.log("SEND QUESTION ERROR:", err);
  });
}

export function stopQuiz(ctx) {
  const id = ctx.from.id;

  clearTimer(id);

  if (users[id]) {
    users[id].active = false;
    users[id].score = 0;
  }

  ctx.reply("⛔ Test to‘xtadi");
}

export function answerHandler(ctx) {
  const id = ctx.from.id;
  const user = users[id];

  if (!user || !user.active) return;

  const ans = Number(ctx.match[1]);
  const q = user.current;

  if (!q) return;

  if (ans === q.correct) {
    user.score += 10;
    ctx.reply("✅ To‘g‘ri!");
  } else {
    ctx.reply("❌ Noto‘g‘ri!");
  }

  sendQuestion(ctx);
}

export { users, timers };
