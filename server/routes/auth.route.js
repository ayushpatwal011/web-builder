import express from "express";
import { googleAuth, logoutUser } from "../controllers/auth.controller.js";
const authRouter =express.Router();

authRouter.post('/google', googleAuth);
authRouter.get('/logout', logoutUser);

export default authRouter;