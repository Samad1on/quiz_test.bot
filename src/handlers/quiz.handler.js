let users = {};

const questions = [
  {
    question: "Tilshunoslik nimani o‘rganadi?",
    answers: ["Tilni", "Matematikani", "Tarixni", "Fizikani"],
    correct: 0,
  },
  {
    question: "Morfema nima?",
    answers: ["So‘z qismi", "Gap", "Jumla", "Tovush"],
    correct: 0,
  },
  {
    question: "Ot nima?",
    answers: ["Predmet nomi", "Harakat", "Belgi", "Raqam"],
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
    correct: 0,
    wrong: 0,
    score: 0,
  };
}

/* ========================= */
export async function getNextQuestion(userId) {
  const u = users[userId];

  if (!u) return null;

  return questions[u.index] || null;
}

/* ========================= */
export async function handleAnswer(userId, answerIndex) {
  const u = users[userId];
  const q = questions[u.index];

  if (!u || !q) return "❌ Xato";

  let result = "";

  if (answerIndex === q.correct) {
    u.correct++;
    u.score += 10;
    result = "✅ To‘g‘ri!";
  } else {
    u.wrong++;
    result = "❌ Noto‘g‘ri!";
  }

  u.index++;

  return result;
}

/* ========================= */
export function getScore(userId) {
  return users[userId] || { correct: 0, wrong: 0, score: 0 };
}
