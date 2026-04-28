import app from "./src/app.js";
import http from "http";

import "./src/bot.js";

const PORT = process.env.PORT || 5000;
const HOST = "0.0.0.0";

const server = http.createServer(app);

server.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on http://${HOST}:${PORT}`);
});
