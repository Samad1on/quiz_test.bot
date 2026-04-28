export function quizKeyboard(options) {
  return {
    reply_markup: {
      inline_keyboard: options.map((opt, i) => [
        { text: opt, callback_data: `answer_${i}` },
      ]),
    },
  };
}
