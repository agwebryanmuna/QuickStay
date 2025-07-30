import User from '../models/User.model.js';

// Middleware to check if a user is authenticated
export const authMiddleware = async (req,res,next) => {
  const { userId } = req.auth();
  if(!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized"
    });
  }
  
  const user = await User.findById(userId);
  if(!user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized"
    });
  }
  req.user = user;
  next();
}
