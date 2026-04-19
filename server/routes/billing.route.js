import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import { billing } from "../controllers/biling.controller.js";
const billingRouter =express.Router();


billingRouter.post('/',isAuth, billing);

export default billingRouter;