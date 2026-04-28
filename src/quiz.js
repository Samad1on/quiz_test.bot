import fs from "fs";
import { parseQuestions } from "./parser.js";

const text = fs.readFileSync("./data/questions.txt", "utf-8");
export const questions = parseQuestions(text);

export const users = {};
export const timers = {};
