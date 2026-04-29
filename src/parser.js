```js
import fs from "fs";
import path from "path";

export function parseQuestions() {
  const filePath = path.join(
    process.cwd(),
    "src",
    "data",
    "questions.txt"
  );

  const raw = fs.readFileSync(
    filePath,
    "utf-8"
  );

  const blocks = raw
    .split("++++")
    .map((b) => b.trim())
    .filter(Boolean);

  const questions = [];

  blocks.forEach((block, index) => {
    const parts = block
      .split("====")
      .map((p) => p.trim())
      .filter(Boolean);

    if (parts.length < 5) return;

    const question = parts[0];

    const answers = [];

    let correct = 0;

    parts.slice(1).forEach((a, i) => {
      if (a.startsWith("#")) {
        correct = i;

        answers.push(
          a.replace("#", "").trim()
        );
      } else {
        answers.push(a.trim());
      }
    });

    questions.push({
      id: index + 1,
      question,
      answers,
      correct,
    });
  });

  return questions;
}
```;
