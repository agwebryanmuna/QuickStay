import "dotenv/config";
import express from "express";

const app = express();

app.get("/", (_, res) => {
  res.send("API working 😘");
});

const PORT = process.env.PORT;
app.listen(PORT, () =>
  console.log(`Server listening on http://localhost:${PORT}`)
);
