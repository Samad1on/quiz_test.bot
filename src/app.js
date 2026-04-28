import express from "express";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("OK 🚀 Server ishlayapti");
});

export default app;
