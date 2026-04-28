import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ✅ HAR DOIM TO‘G‘RI PATH */
const filePath = path.join(__dirname, "../data/questions.txt");

if (!fs.existsSync(filePath)) {
  throw new Error("questions.txt topilmadi (data papkani tekshir)");
}

const text = fs.readFileSync(filePath, "utf-8");

export const questions = text.split("++++").map((b, i) => {
  const lines = b.trim().split("\n").filter(Boolean);

  return {
    id: i,
    question: lines[0],
    answers: lines.slice(1).map((l) => l.replace("#", "")),
    correct: 0,
  };
});

export const users = {};
export const timers = {};
