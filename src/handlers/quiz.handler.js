let users = {};

const questions = [
  {
    question: "Ot nima?",
    answers: ["So‘z turi", "Raqam", "Tovush", "Gap"],
    correct: 0,
  },
  {
    question: "Fe’l nima?",
    answers: ["Harakat", "Predmet", "Belgi", "Son"],
    correct: 0,
  },
  {
    question: "Morfema nima?",
    answers: ["So‘z qismi", "Gap", "Matn", "Tovush"],
    correct: 0,
  },
];

/* ========================= */
export async function initQuiz() {
  console.log("Quiz loaded");
}

/* ========================= */
export async function resetUser(userId) {
  users[userId] = {
    index: 0,
    used: [],
    score: 0,
  };
}

/* ========================= */
export function stopQuiz(userId) {
  if (users[userId]) {
    users[userId].stopped = true;
  }
}

/* ========================= */
export async function getNextQuestion(userId) {
  const u = users[userId];

  if (!u || u.stopped) return null;

  const available = questions.filter((_, i) => !u.used.includes(i));

  if (available.length === 0) return null;

  const random = available[Math.floor(Math.random() * available.length)];
  const index = questions.indexOf(random);

  u.used.push(index);

  return random;
}

/* ========================= */
export async function handleAnswer(userId, answerIndex) {
  const u = users[userId];

  if (!u) return "❌ error";

  const qIndex = u.used[u.used.length - 1];
  const q = questions[qIndex];

  if (!q) return "❌ error";

  if (answerIndex === q.correct) {
    u.score += 10;
    return "✅ To‘g‘ri!";
  }

  return "❌ Noto‘g‘ri!";
}
