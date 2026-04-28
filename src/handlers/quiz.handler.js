let users = {};

const questions = globalThis.ALL_QUESTIONS || [];

export async function initQuiz() {
  console.log("Quiz loaded:", questions.length);
}

/* ========================= */
export async function resetUser(userId) {
  users[userId] = {
    used: [],
    score: 0,
    stopped: false,
  };
}

/* ========================= */
export function stopQuiz(userId) {
  if (users[userId]) {
    users[userId].stopped = true;
  }
}

/* ========================= */
export async function getRandomQuestion(userId) {
  const u = users[userId];

  if (!u || u.stopped) return null;

  const available = questions.filter((_, i) => !u.used.includes(i));

  if (available.length === 0) {
    u.used = []; // restart cycle (infinite)
    return getRandomQuestion(userId);
  }

  const q = available[Math.floor(Math.random() * available.length)];
  const index = questions.indexOf(q);

  u.used.push(index);

  return q;
}

/* ========================= */
export async function handleAnswer(userId, i) {
  const u = users[userId];

  if (!u) return "❌ error";

  const last = u.used[u.used.length - 1];
  const q = questions[last];

  if (!q) return "❌ error";

  if (i === q.correct) {
    u.score += 10;
    return `✅ To‘g‘ri | Ball: ${u.score}`;
  }

  return `❌ Noto‘g‘ri | Ball: ${u.score}`;
}
