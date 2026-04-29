const users = {};
const polls = {};
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
    question: "2 + 2 = ?",
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
      used: [],
    };
  }
}

// ================= RANDOM QUESTION =================
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
  const id = ctx.chat.id;

  const user = users[id];

  if (!user || !user.active) return;

  const q = getQuestion(user);

  // ================= FINISH =================
  if (!q) {
    clearTimer(id);

    user.active = false;

    return ctx.reply(`🎉 Test tugadi!\n🏆 Ball: ${user.score}`, {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "🚀 Qayta boshlash",
              callback_data: "start",
            },
          ],
        ],
      },
    });
  }

  // ================= POLL =================
  const pollMessage = await ctx.replyWithPoll(`❓ ${q.question}`, q.answers, {
    type: "quiz",
    correct_option_id: q.correct,

    // 🔥 KIM JAVOB BERGANI KO‘RINADI
    is_anonymous: false,

    // 🔥 30 SEKUND
    open_period: 30,
  });

  polls[pollMessage.poll.id] = {
    chatId: id,
    question: q,
  };

  // ================= STOP BUTTON =================
  await ctx.reply("⛔ Quizni to‘xtatish", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "⛔ STOP",
            callback_data: "stop",
          },
        ],
      ],
    },
  });

  clearTimer(id);

  timers[id] = setTimeout(async () => {
    const currentUser = users[id];

    if (!currentUser || !currentUser.active) return;

    currentUser.used.push(q.id);

    await ctx.telegram.sendMessage(id, "⏰ Vaqt tugadi!").catch(() => {});

    sendQuestion(ctx);
  }, 30000);
}

// ================= START =================
export function startQuiz(ctx) {
  const id = ctx.chat.id;

  initUser(id);

  users[id].active = true;
  users[id].score = 0;
  users[id].used = [];

  sendQuestion(ctx);
}

// ================= STOP =================
export function stopQuiz(ctx) {
  const id = ctx.chat.id;

  clearTimer(id);

  if (users[id]) {
    users[id].active = false;
  }

  ctx.reply(`🛑 Quiz to‘xtadi\n🏆 Ball: ${users[id]?.score || 0}`, {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "🚀 Qayta boshlash",
            callback_data: "start",
          },
        ],
      ],
    },
  });
}

// ================= POLL ANSWER =================
export async function handlePollAnswer(bot, pollAnswer) {
  const pollId = pollAnswer.poll_id;

  const pollData = polls[pollId];

  if (!pollData) return;

  const user = users[pollData.chatId];

  if (!user || !user.active) return;

  clearTimer(pollData.chatId);

  const selected = pollAnswer.option_ids[0];

  const q = pollData.question;

  // ================= CHECK =================
  if (selected === q.correct) {
    user.score += 10;

    await bot.telegram.sendMessage(
      pollData.chatId,
      `✅ To‘g‘ri!\n🏆 Ball: ${user.score}`,
    );
  } else {
    await bot.telegram.sendMessage(
      pollData.chatId,
      `❌ Noto‘g‘ri!\n🏆 Ball: ${user.score}`,
    );
  }

  user.used.push(q.id);

  setTimeout(() => {
    sendQuestion({
      chat: { id: pollData.chatId },

      reply: (...args) =>
        bot.telegram.sendMessage(pollData.chatId, args[0], args[1]),

      replyWithPoll: (...args) =>
        bot.telegram.sendPoll(pollData.chatId, args[0], args[1], args[2]),

      telegram: bot.telegram,
    });
  }, 1000);
}

export { users, polls, timers };
