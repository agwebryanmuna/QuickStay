import express from 'express';
import { authMiddleware } from "../middleware/authMiddleware.js";
import { createRoom, getOwnerRooms, getRooms, toggleRoomAvailability } from "../controllers/roomController.js";
import upload from "../middleware/uploadMiddleware.js";

const roomRouter = express.Router();

roomRouter.get('/', getRooms)
roomRouter.post('/create', authMiddleware, upload.array('images', 4), createRoom);
roomRouter.get('/owner', authMiddleware, getOwnerRooms)
roomRouter.post('/toggle-availability', authMiddleware, toggleRoomAvailability)

export default roomRouter;
