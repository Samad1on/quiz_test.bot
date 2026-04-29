import { parseQuestions } from "./parser.js";

const questions = parseQuestions();

const users = {};
const polls = {};
const timers = {};

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
  // 🔥 hammasi tugasa qaytadan boshlaydi
  if (user.used.length >= questions.length) {
    user.used = [];
  }

  const available = questions.filter((q) => !user.used.includes(q.id));

  return available[Math.floor(Math.random() * available.length)];
}

// ================= CLEAR TIMER =================
function clearTimer(id) {
  if (timers[id]) {
    clearTimeout(timers[id]);

    delete timers[id];
  }
}

// ================= BUTTONS =================
function getButtons(username) {
  return {
    inline_keyboard: [
      [
        {
          text: "⛔ STOP",
          callback_data: "stop",
        },
      ],

      [
        {
          text: "👥 Guruhga qo‘shish",
          url: `https://t.me/${username}?startgroup=true`,
        },
      ],
    ],
  };
}

// ================= SEND QUESTION =================
export async function sendQuestion(ctx) {
  const id = ctx.chat.id;

  const user = users[id];

  if (!user || !user.active) return;

  const q = getQuestion(user);

  const pollMessage = await ctx.replyWithPoll(`❓ ${q.question}`, q.answers, {
    type: "quiz",

    correct_option_id: q.correct,

    is_anonymous: false,

    open_period: 30,
  });

  polls[pollMessage.poll.id] = {
    chatId: id,
    question: q,
  };

  await ctx.reply("👇 Quiz boshqaruvi", {
    reply_markup: getButtons(ctx.botInfo.username),
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

  sendQuestion(ctx);
}

// ================= STOP =================
export async function stopQuiz(ctx) {
  const id = ctx.chat.id;

  clearTimer(id);

  if (users[id]) {
    users[id].active = false;
  }

  await ctx.reply(`🛑 Quiz to‘xtadi\n🏆 Ball: ${users[id]?.score || 0}`, {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "🚀 Qayta boshlash",
            callback_data: "start",
          },
        ],

        [
          {
            text: "👥 Guruhga qo‘shish",
            url: `https://t.me/${ctx.botInfo.username}?startgroup=true`,
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

  // ================= RESULT =================
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
      chat: {
        id: pollData.chatId,
      },

      reply: (...args) =>
        bot.telegram.sendMessage(pollData.chatId, args[0], args[1]),

      replyWithPoll: (...args) =>
        bot.telegram.sendPoll(pollData.chatId, args[0], args[1], args[2]),

      telegram: bot.telegram,

      botInfo: bot.botInfo,
    });
  }, 500);
}

export { users, polls, timers };
