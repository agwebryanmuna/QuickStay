import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
  hotel: { type: String, required: true, ref: 'Hotel' },
  roomType: { type: String, required: true },
  pricePerNight: { type: Number, required: true },
  amenities: { type: Array, required: true },
  images: { type: [ String ] },
  isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

const Room = mongoose.models.Room || mongoose.model("Room", RoomSchema);

export default Room;
