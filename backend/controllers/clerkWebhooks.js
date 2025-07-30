import User from '../models/User.model.js';
import { Webhook } from "svix";

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
    username: data.firstName + ' ' + data.lastName,
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
      break;
    }
    
    default:
      break;
  }
  
  res.json({ success: true, message: 'Webhook received successfully!' });
  
}

export default clerkWebhooks;
