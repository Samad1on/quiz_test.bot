import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { parseQuestions } from "./parser.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// to‘liq path (serverga 100% mos)
const filePath = path.join(__dirname, "../data/questions.txt");

const text = fs.readFileSync(filePath, "utf-8");

export const questions = parseQuestions(text);
export const users = {};
export const timers = {};
