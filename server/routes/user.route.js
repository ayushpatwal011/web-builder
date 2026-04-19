import express from "express";
const userRouter =express.Router();
import { isAuth } from "../middlewares/isAuth.js";
import { getCurrentUser } from "../controllers/user.controller.js";

userRouter.get('/me',isAuth, getCurrentUser);

export default userRouter;
