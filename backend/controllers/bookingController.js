// function to check room availability
import Booking from "../models/Booking.model.js";
import Room from "../models/Room.modle.js";
import Hotel from "../models/Hotel.model.js";

const checkAvailability = async ({ checkInDate, checkOutDate, room }) => {
  const bookings = await Booking.find({
    room,
    checkInDate: { $lte: checkInDate },
    checkOutDate: { $gte: checkOutDate },
  })
  return bookings.length === 0;
  
}

// API to check the availability of room
export const checkRoomAvailability = async (req, res) => {
  const { checkInDate, checkOutDate, room } = req.body;
  const isAvailable = await checkAvailability({ checkInDate, checkOutDate, room });
  res.status(200).json({ success: true, data: isAvailable });
}


// create a new booking
export const createBooking = async (req, res) => {
  
  const { checkInDate, checkOutDate, room, guests, paymentMethod } = req.body;
  const user = req.user._id;
  const isAvailable = await checkAvailability({ checkInDate, checkOutDate, room });
  
  if (!isAvailable) return res.status(400).json({ success: false, message: "Room is not available" })
  
  
  // get total price for a room
  const roomData = await Room.findById(room).populate('hotel')
  const checkIn = new Date(checkInDate)
  const checkOut = new Date(checkOutDate)
  const diff = checkOut.getTime() - checkIn.getTime()
  const nights = Math.ceil(diff / (1000 * 3600 * 24))
  
  let totalPrice = roomData.pricePerNight * nights
  
  const booking = await Booking.create({
    user,
    hotel: roomData.hotel._id,
    checkInDate,
    checkOutDate,
    room,
    guests: +guests,
    totalPrice,
  })
  
  res.status(201).json({ success: true, message: "Booking created successfully", })
}


// get all bookings for a user
export const getUserBookings = async (req, res) => {
  
  const user = req.user._id;
  const bookings = await Booking.find({ user }).populate('room hotel').sort({ createdAt: -1 })
  res.status(200).json({ success: true, data: bookings })
  
}


// get hotel bookings for a user
export const getHotelBookings = async (req, res) => {
  const hotel = await Hotel.findOne({ owner: req.auth().userId })
  if (!hotel) return res.status(404).json({ success: false, message: "Hotel not found" })
  const bookings = await Booking.find({ hotel: hotel._id }).populate('room hotel user').sort({ createdAt: -1 })
  
  // total bookings
  const totalBookings = bookings.length
  
  // total revenue
  let totalRevenue = bookings.reduce((acc, booking) => acc + booking.totalPrice, 0)
  
  res.status(200).json({ success: true, data: { bookings, totalBookings, totalRevenue } })
}
