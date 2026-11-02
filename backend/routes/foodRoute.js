import express from "express";
import { addFood, updateFood, toggleAvailability, listFood, removeFood } from "../controllers/foodController.js";
import multer from "multer";

const foodRouter = express.Router();

// use memory storage — file buffer goes to Cloudinary, not local disk
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: Number(process.env.MAX_UPLOAD_SIZE_BYTES) || 4 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            return cb(null, true);
        }
        return cb(new Error("Only image uploads are allowed"));
    }
});

foodRouter.post("/add", upload.single("image"), addFood);
foodRouter.put("/update/:id", upload.single("image"), updateFood);
foodRouter.patch("/toggle/:id", toggleAvailability);
foodRouter.get("/list", listFood);
foodRouter.post("/remove", removeFood);

export default foodRouter;
