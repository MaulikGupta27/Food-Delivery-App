import express from 'express';
import { loginUser, registerUser } from '../controllers/userController.js';


const userRouter = express.Router();

/**
 * @openapi
 * /api/user/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - User
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: User registered
 */
userRouter.post('/register', registerUser);

/**
 * @openapi
 * /api/user/login:
 *   post:
 *     summary: Login a user
 *     tags:
 *       - User
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: User logged in
 */
userRouter.post('/login', loginUser);

export default userRouter;