import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  _id: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image: { type: String, required: true },
  role: { type: String, enum: [ 'user', 'hotelOwner' ], default: 'user' },
  recentSearchedCities: { type: [ String ], default: [], required: true }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
