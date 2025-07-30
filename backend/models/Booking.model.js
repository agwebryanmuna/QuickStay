import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
  user: { type: String, required: true, ref: 'User' },
  hotel: { type: String, required: true, ref: 'Hotel' },
  room: { type: String, required: true, ref: 'Room' },
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },
  totalPrice: { type: Number, required: true },
  isPaid: { type: Boolean, default: false },
  guests: { type: Number, required: true },
  status: { type: String, enum: [ 'pending', 'confirmed', 'cancelled' ], default: 'pending' },
  paymentMethod: { type: String, default: 'Pay at Hotel', required: true }
}, { timestamps: true });

const Booking = mongoose.models.Booking || mongoose.model("Booking", BookingSchema);

export default Booking;
