let users = {};

const questions = Array.from({ length: 100 }, (_, i) => ({
  question: `${i + 1}-savol: Ot nima?`,
  answers: ["So‘z turi", "Gap", "Tovush", "Raqam"],
  correct: 0,
}));

/* ========================= */
export async function initQuiz() {
  console.log("Quiz loaded");
}

/* ========================= */
export async function resetUser(userId) {
  users[userId] = {
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

  const randomIndex = Math.floor(Math.random() * questions.length);

  return questions[randomIndex];
}

/* ========================= */
export async function handleAnswer(userId, answerIndex) {
  const u = users[userId];

  if (!u) return "❌ error";

  const correct = 0;

  if (answerIndex === correct) {
    u.score += 10;
    return `✅ To‘g‘ri | Ball: ${u.score}`;
  }

  return `❌ Noto‘g‘ri | Ball: ${u.score}`;
}
