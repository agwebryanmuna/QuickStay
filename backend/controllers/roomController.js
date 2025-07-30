// create new room
import Hotel from "../models/Hotel.model.js";
import { v2 as cloudinary } from "cloudinary";
import Room from "../models/Room.modle.js";

export const createRoom = async (req, res) => {
  const { roomType, pricePerNight, amenities } = req.body;
  const hotel = await Hotel.findOne({ owner: req.auth().userId })
  
  if (!hotel) return res.status(404).json({ success: false, message: "Hotel not found" })
  
  // upload images to cloudinary
  const uploadImages = req.files.map(async (file) => {
    const response = await cloudinary.uploader.upload(file.path, {
      folder: "hotel-booking/rooms/",
      public_id: `${hotel._id}-${roomType}-${file.originalname}`,
    })
    return response?.secure_url
  })
  
  const images = await Promise.all(uploadImages)
  
  await Room.create({
    hotel: hotel._id,
    roomType,
    pricePerNight: +pricePerNight,
    amenities: JSON.parse(amenities),
    images,
  })
  
  res.status(201).json({ success: true, message: "Room created successfully" })
}

// get all rooms
export const getRooms = async (req, res) => {
  
  const rooms = await Room.find({ isAvailable: true }).populate({
    path: "hotel",
    populate: {
      path: "owner",
      select: "image"
    }
  }).sort({ createdAt: -1 })
  
  res.status(200).json({ success: true, data: rooms })
}

// get all rooms for a specific hotel
export const getOwnerRooms = async (req, res) => {
  const hotelData = await Hotel.findOne({ owner: req.auth().userId })
  const rooms = await Room.find({ hotel: hotelData._id.toString() }).populate('hotel')
  res.status(200).json({ success: true, data: rooms })
}

// toggle room availability
export const toggleRoomAvailability = async (req, res) => {
  
  const { roomId } = req.body;
  const room = await Room.findById(roomId);
  room.isAvailable = !room.isAvailable;
  await room.save();
  
  res.status(200).json({ success: true, message: 'Room availability updated successfully' });
  
}
