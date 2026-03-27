import express from "express";
import { adminLogin, adminLogout } from "../controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.post("/login", adminLogin);
adminRouter.post("/logout", adminLogout);

export default adminRouter;
