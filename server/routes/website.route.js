import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import { changes, deleteWebsite, deploy, generateWebsite, generateWebsiteByAgent, getAllWebistes, getBySlug, getWebsitesById } from "../controllers/website.controller.js";
const websiteRouter =express.Router();

// websiteRouter.post('/generate', isAuth, generateWebsite);
websiteRouter.post('/generate', isAuth, generateWebsiteByAgent);
websiteRouter.post('/update/:id', isAuth, changes);
websiteRouter.get('/get-by-id/:id', isAuth, getWebsitesById);
websiteRouter.get('/all', isAuth, getAllWebistes);
websiteRouter.get('/deploy/:id', isAuth, deploy);
websiteRouter.get('/get-by-slug/:slug', isAuth, getBySlug);
websiteRouter.delete('/delete/:id', isAuth, deleteWebsite);

export default websiteRouter;