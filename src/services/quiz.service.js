import fs from "fs";
import path from "path";

export async function loadQuestions() {
  const filePath = path.join(process.cwd(), "src", "data", "questions.txt");

  const text = fs.readFileSync(filePath, "utf8");

  const raw = text
    .split("++++")
    .map((q) => q.trim())
    .filter(Boolean);

  return raw.map((block) => {
    const parts = block
      .split("====")
      .map((p) => p.trim())
      .filter(Boolean);

    const question = parts[0];

    let answer = -1;

    const options = parts.slice(1).map((opt, i) => {
      if (opt.startsWith("#")) {
        answer = i;
        return opt.replace("#", "");
      }
      return opt;
    });

    return { q: question, options, answer };
  });
}
