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

    const answers = [];
    let correct = -1;

    // 🔥 CLEAN LOOP (BEST PRACTICE)
    for (let i = 1; i < parts.length; i++) {
      const item = parts[i];

      if (item.startsWith("#")) {
        correct = i - 1;
        answers.push(item.replace("#", "").trim());
      } else {
        answers.push(item);
      }
    }

    // 🔥 safety check
    if (correct === -1) correct = 0;

    questions.push({
      id: questions.length + 1,
      question,
      answers,
      correct,
    });
  }

  return questions;
}
