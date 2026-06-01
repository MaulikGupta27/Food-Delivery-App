import express from "express";
import { addToCart, getCart, removeFromCart } from "../controllers/cartController.js";
import { authMiddleware } from "../middlewares/auth.js";

const cartRouter = express.Router();

/**
 * @openapi
 * /api/cart/add:
 *   post:
 *     summary: Add item to cart
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               foodId:
 *                 type: string
 *               quantity:
 *                 type: integer
 *     responses:
 *       '200':
 *         description: Item added to cart
 */
cartRouter.post("/add", authMiddleware, addToCart);

/**
 * @openapi
 * /api/cart/remove:
 *   post:
 *     summary: Remove item from cart
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               foodId:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Item removed from cart
 */
cartRouter.post("/remove", authMiddleware, removeFromCart);

/**
 * @openapi
 * /api/cart/get:
 *   post:
 *     summary: Get current user's cart
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: User cart
 */
cartRouter.post("/get", authMiddleware, getCart);

export default cartRouter;