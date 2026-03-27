import express from "express";
import { addFood, listFood, removeFood } from "../controllers/foodController.js";
import multer from "multer";    // for image storage

const foodRouter = express.Router();

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
foodRouter.get("/list", listFood);
foodRouter.post("/remove", removeFood);

export default foodRouter;