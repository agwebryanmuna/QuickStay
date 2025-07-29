import "dotenv/config";
import express from "express";
import connectDb from "./config/db.js";

const app = express();

await connectDb()

app.get("/", (_, res) => {
  res.send("API working 😘");
});


// Error handler. Must be defined last after other app.use.
app.use((err, req, res, next) => {
  console.error(err);
  res?.status(err?.status || 500).json({
    status: err?.status,
    message: err?.message || "Something went wrong!",
  });
});


const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`Server listening on http://localhost:${PORT}`)
);
