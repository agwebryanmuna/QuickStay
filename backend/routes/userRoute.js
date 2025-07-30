import express from 'express';
import { getUserData,storeRecentSearchedCities } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const userRouter = express.Router();

userRouter.get('/',authMiddleware,getUserData);
userRouter.post('/store-recent-search',authMiddleware,storeRecentSearchedCities);

export default userRouter;
