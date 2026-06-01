import express from "express";
import { authMiddleware } from "../middlewares/auth.js";
import { adminAuthMiddleware } from "../middlewares/adminAuth.js";
import { placeOrder, verifyOrder, userOrders, listOrders, updateStatus } from "../controllers/orderController.js";

const orderRouter = express.Router();

/**
 * @openapi
 * /api/order/place:
 *   post:
 *     summary: Place a new order
 *     tags:
 *       - Order
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       '200':
 *         description: Order placed
 */
orderRouter.post("/place", authMiddleware, placeOrder);

/**
 * @openapi
 * /api/order/verify:
 *   get:
 *     summary: Verify an order (GET)
 *     tags:
 *       - Order
 *     responses:
 *       '200':
 *         description: Verification result
 */
orderRouter.get("/verify", verifyOrder);

/**
 * @openapi
 * /api/order/verify:
 *   post:
 *     summary: Verify an order (POST)
 *     tags:
 *       - Order
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       '200':
 *         description: Verification result
 */
orderRouter.post("/verify", verifyOrder);

/**
 * @openapi
 * /api/order/userorders:
 *   post:
 *     summary: Get orders for current user
 *     tags:
 *       - Order
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: User orders
 */
orderRouter.post("/userorders", authMiddleware, userOrders);

/**
 * @openapi
 * /api/order/list:
 *   get:
 *     summary: List all orders (admin)
 *     tags:
 *       - Order
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Order list
 */
orderRouter.get("/list", adminAuthMiddleware, listOrders);

/**
 * @openapi
 * /api/order/status:
 *   post:
 *     summary: Update order status (admin)
 *     tags:
 *       - Order
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       '200':
 *         description: Status updated
 */
orderRouter.post("/status", adminAuthMiddleware, updateStatus);

export default orderRouter;