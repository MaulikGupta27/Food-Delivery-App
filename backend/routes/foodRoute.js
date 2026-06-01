import express from "express";
import { addFood, listFood, removeFood } from "../controllers/foodController.js";
import multer from "multer";    // for image storage

const foodRouter = express.Router();

/**
 * @openapi
 * /api/food/add:
 *   post:
 *     summary: Add a new food item
 *     tags:
 *       - Food
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       '200':
 *         description: Food added
 */

// image storage engine using multer disc storage
const storage =multer.diskStorage({
    destination: "uploads", 
    filename: (req, file, cb)=> {
        return cb(null, `${Date.now()}_${file.originalname}`);
    }
})

// file filter and size limit for multer
const upload = multer({
    storage,
    limits: { fileSize: Number(process.env.MAX_UPLOAD_SIZE_BYTES) || 2 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            return cb(null, true);
        }
        return cb(new Error("Only image uploads are allowed"));
    }
});

foodRouter.post("/add", upload.single("image"), addFood);

/**
 * @openapi
 * /api/food/list:
 *   get:
 *     summary: Get list of food items
 *     tags:
 *       - Food
 *     responses:
 *       '200':
 *         description: A list of food items
 */
foodRouter.get("/list", listFood);

/**
 * @openapi
 * /api/food/remove:
 *   post:
 *     summary: Remove a food item
 *     tags:
 *       - Food
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Food removed
 */
foodRouter.post("/remove", removeFood);

export default foodRouter;