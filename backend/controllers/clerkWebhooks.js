import User from '../models/User.model.js';
import { Webhook } from "svix";
import Booking from "../models/Booking.model.js";
import Room from "../models/Room.modle.js";
import Hotel from "../models/Hotel.model.js";

const clerkWebhooks = async (req, res) => {
  const hook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
  
  // getting headers
  const headers = {
    "svix-id": req.headers["svix-id"],
    "svix-timestamp": req.headers["svix-timestamp"],
    "svix-signature": req.headers["svix-signature"],
  }
  
  // verifying headers
  await hook.verify(JSON.stringify(req.body), headers);
  
  // getting data from the request body
  const { data, type } = req.body;
  
  const userData = {
    _id: data.id,
    email: data.email_addresses[0].email_address,
    username: data.first_name + ' ' + data.last_name || data.email_addresses[0].email_address.split('@')[0],
    image: data.image_url,
  }
  
  // switch cases for different events
  switch (type) {
    case "user.created": {
      await User.create(userData);
      break;
    }
    case "user.updated": {
      await User.findByIdAndUpdate(
        data.id,
        userData,
      )
      break;
    }
    case "user.deleted": {
      await User.findByIdAndDelete(data.id)
      // Delete all user bookings, rooms and hotels
      const userHotels = await Hotel.find({ owner: data.id })
      if (userHotels) {
        await Booking.deleteMany({ hotel: userHotels._id })
        await Room.deleteMany({ hotel: userHotels._id })
        await Hotel.deleteMany({ owner: data.id })
      }
      break;
    }
    
    default:
      break;
  }
  
  res.json({ success: true, message: 'Webhook received successfully!' });
  
}

export default clerkWebhooks;
