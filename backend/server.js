import "dotenv/config";
import express from "express";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import connectDb from "./config/db.js";
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from "./controllers/clerkWebhooks.js";

const app = express();

await connectDb()

// middlewares
app.use(express.json());
// app.use(cors(corsOptions))
app.use(cors());
// compress all responses
app.use(compression());
// secure http response headers
app.use(helmet());
app.use(clerkMiddleware())

// API to listen for clerk webhooks
app.use('/api/clerk', clerkWebhooks)

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
