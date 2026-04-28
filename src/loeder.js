import fs from "fs";

const data = fs.readFileSync("./src/data/questions.txt", "utf-8");
export function loadQuestions() {
  return data
    .split("\n")
    .filter(Boolean)
    .map((line, index) => {
      const [question, a, b, c, d, correct] = line
        .split("|")
        .map((x) => x.trim());

      return {
        id: index,
        question,
        answers: [a, b, c, d],
        correct: Number(correct),
      };
    });
}
