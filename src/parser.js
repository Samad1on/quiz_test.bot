import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function parseQuestions() {
  const filePath = path.join(__dirname, "data/questions.txt");

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

    if (parts.length < 2) continue;

    const question = parts[0];

    const answers = [];
    let correct = 0;

    for (let i = 1; i < parts.length; i++) {
      const item = parts[i];

      if (item.startsWith("#")) {
        correct = i - 1;
        answers.push(item.slice(1).trim());
      } else {
        answers.push(item);
      }
    }

    questions.push({
      id: questions.length + 1,
      question,
      answers,
      correct,
    });
  }

  return questions;
}
