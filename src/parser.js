export function parseQuestions(text) {
  const blocks = text
    .split("++++")
    .map((x) => x.trim())
    .filter(Boolean);

  return blocks.map((block, index) => {
    const lines = block
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    const question = lines[0].replace(/^====|^#/, "").trim();

    const answers = [];
    let correct = 0;

    let idx = 0;

    for (let i = 1; i < lines.length; i++) {
      if (lines[i].startsWith("====")) {
        const ans = lines[i].replace("====", "").replace("#", "").trim();

        if (lines[i].includes("#")) {
          correct = idx;
        }

        answers.push(ans);
        idx++;
      }
    }

    return {
      id: index,
      question,
      answers,
      correct,
    };
  });
}
