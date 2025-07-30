import express from 'express';
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  checkRoomAvailability,
  createBooking,
  getHotelBookings,
  getUserBookings
} from "../controllers/bookingController.js";

const bookingRouter = express.Router();

bookingRouter.post('/check-availability', checkRoomAvailability);
bookingRouter.post('/book', authMiddleware, createBooking);
bookingRouter.get('/user', authMiddleware, getUserBookings);
bookingRouter.get('/hotel', authMiddleware, getHotelBookings);

export default bookingRouter;
