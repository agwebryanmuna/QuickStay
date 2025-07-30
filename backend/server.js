import "dotenv/config";
import express from "express";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import connectDb from "./config/db.js";
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from "./controllers/clerkWebhooks.js";
import userRouter from "./routes/userRoute.js";
import hotelRouter from "./routes/hotelRoute.js";
import connectCloudinary from "./config/cloudinary.js";
import roomRouter from "./routes/roomRoute.js";
import bookingRouter from "./routes/bookingRoute.js";

const app = express();

await connectDb()
await connectCloudinary();

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

// routes
app.use("/api/users", userRouter)
app.use("/api/hotels", hotelRouter)
app.use("/api/rooms", roomRouter)
app.use("/api/bookings", bookingRouter)

app.get("/", (_, res) => {
  res.send("API working 😘");
});


// Error handler. Must be defined last after other app.use.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err?.status || 500).json({
    success: false,
    message: err?.message || "Internal server error!",
  });
});


const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`Server listening on http://localhost:${PORT}`)
);
