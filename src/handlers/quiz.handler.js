import { setState, getState } from "../state/user.state.js";
import { quizKeyboard } from "../keyboards/quiz.keyboard.js";

let questions = [];

export async function initQuiz() {
  const mod = await import("../services/quiz.service.js");
  questions = await mod.loadQuestions();

  console.log("✅ Loaded:", questions.length);
}

export function startQuiz(ctx) {
  const userId = ctx.from.id;

  setState(userId, { step: 0, score: 0 });

  sendQuestion(ctx);
}

export function handleAnswer(ctx, index) {
  const userId = ctx.from.id;

  const state = getState(userId);
  if (!state) return ctx.reply("Start bosing /start");

  const q = questions[state.step];

  if (!q) return ctx.reply("Savol topilmadi");

  if (index === q.answer) {
    state.score++;
    ctx.reply("✅ To‘g‘ri!");
  } else {
    ctx.reply(`❌ Noto‘g‘ri\nTo‘g‘ri javob: ${q.options[q.answer]}`);
  }

  state.step++;
  setState(userId, state);

  if (state.step >= questions.length) {
    return ctx.reply(`🎉 Tugadi\n🏆 ${state.score}/${questions.length}`);
  }

  sendQuestion(ctx);
}

function sendQuestion(ctx) {
  const state = getState(ctx.from.id);
  const q = questions[state.step];

  ctx.reply(`❓ ${q.q}`, quizKeyboard(q.options));
}
