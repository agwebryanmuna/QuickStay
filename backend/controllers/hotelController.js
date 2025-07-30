import Hotel from "../models/Hotel.model.js";
import User from "../models/User.model.js";


export const registerHotel = async (req, res) => {
  const { name, address, contact, city } = req.body;
  const owner = req.user._id;
  
  // check if a user is already registered
  const hotel = await Hotel.findOne({ owner })
  if (hotel) return res.status(400).json({ error: "Hotel already exists" })
  
  await Hotel.create({ name, address, contact, city, owner })
  
  await User.findByIdAndUpdate(owner, { role: "hotelOwner" })
  
  res.status(201).json({ success: true, message: "Hotel registered successfully" })
  
}
