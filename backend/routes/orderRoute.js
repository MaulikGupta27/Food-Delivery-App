import express from "express";
import { authMiddleware } from "../middlewares/auth.js";
import { adminAuthMiddleware } from "../middlewares/adminAuth.js";
import { placeOrder, verifyOrder, userOrders, listOrders, updateStatus } from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.get("/verify", verifyOrder);
orderRouter.post("/verify", verifyOrder);
orderRouter.post("/userorders", authMiddleware, userOrders);
orderRouter.get("/list", adminAuthMiddleware, listOrders);
orderRouter.post("/status", adminAuthMiddleware, updateStatus);

export default orderRouter;