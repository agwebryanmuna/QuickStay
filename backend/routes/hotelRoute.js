import express from 'express';
import { authMiddleware } from "../middleware/authMiddleware.js";
import { registerHotel } from "../controllers/hotelController.js";

const hotelRouter = express.Router();

hotelRouter.post('/register', authMiddleware, registerHotel);

export default hotelRouter;
