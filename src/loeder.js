import fs from "fs";

export function loadQuestions() {
  const data = fs.readFileSync("./questions.txt", "utf-8");

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
