import express from 'express';
import {
    loginUser,
    registerUser,
    getProfile,
    updateProfile,
    addAddress,
    deleteAddress,
    changePassword
} from '../controllers/userController.js';
import { authMiddleware } from '../middlewares/auth.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);

// Protected user routes
userRouter.get('/profile', authMiddleware, getProfile);
userRouter.put('/profile', authMiddleware, updateProfile);
userRouter.post('/address', authMiddleware, addAddress);
userRouter.delete('/address/:addressId', authMiddleware, deleteAddress);
userRouter.put('/change-password', authMiddleware, changePassword);

export default userRouter;
