import mongoose from "mongoose";

const HotelSchema = new mongoose.Schema({
  name: { type: String,required: true },
  address: { type: String,required: true },
  contact: { type: String,required: true },
  owner: { type: String,required: true,ref: 'User' },
  city: { type: String,required: true },
},{ timestamps: true });

const Hotel = mongoose.models.Hotel || mongoose.model("Hotel",HotelSchema);

export default Hotel;
