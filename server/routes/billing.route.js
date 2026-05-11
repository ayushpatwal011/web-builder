import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import { billing, verifySession } from "../controllers/biling.controller.js";
const billingRouter = express.Router();


billingRouter.post('/', isAuth, billing);
billingRouter.post('/verify-session', isAuth, verifySession);

export default billingRouter;