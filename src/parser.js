import fs from "fs";

export function parseQuestions(filePath) {
  const raw = fs.readFileSync(filePath, "utf-8");

  const blocks = raw
    .split("++++")
    .map((b) => b.trim())
    .filter(Boolean);

  const questions = [];

  for (const block of blocks) {
    const parts = block
      .split("====")
      .map((p) => p.trim())
      .filter(Boolean);

    if (parts.length < 5) continue;

    const question = parts[0];

    const answers = parts.slice(1).map((a) => a.replace("#", ""));
    const correctIndex = parts.findIndex((a) => a.startsWith("#")) - 1;

    const correct = parts.slice(1).findIndex((a) => a.startsWith("#"));

    questions.push({
      question,
      answers,
      correct: correct >= 0 ? correct : 0,
    });
  }

  return questions;
}
