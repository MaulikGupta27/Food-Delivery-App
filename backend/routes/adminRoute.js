import express from "express";
import { adminLogin, adminLogout } from "../controllers/adminController.js";

const adminRouter = express.Router();

/**
 * @openapi
 * /api/admin/login:
 *   post:
 *     summary: Admin login
 *     tags:
 *       - Admin
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Admin logged in
 */
adminRouter.post("/login", adminLogin);

/**
 * @openapi
 * /api/admin/logout:
 *   post:
 *     summary: Admin logout
 *     tags:
 *       - Admin
 *     responses:
 *       '200':
 *         description: Admin logged out
 */
adminRouter.post("/logout", adminLogout);

export default adminRouter;
