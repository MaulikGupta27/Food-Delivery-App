import foodModel from "../models/foodModel.js";
import cloudinary from "../config/cloudinary.js";

// add food item to database
const addFood = async (req, res) => {
    try {
        // upload image buffer to Cloudinary
        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: "food_delivery" },
                (error, result) => {
                    if (error) return reject(error);
                    return resolve(result);
                }
            );
            stream.end(req.file.buffer);
        });

        const food = new foodModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            image: result.secure_url
        })

        await food.save();
        res.status(201).json({ success: true, message: "Food item added successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Failed to add food item" });
    }
}

// list all food items from database
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({});
        res.status(200).json({ success: true, data: foods });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Failed to fetch food items" });
    }
}

// remove food item from database
const removeFood = async (req, res) => {
    try {
        const food = await foodModel.findById(req.body.id);
        if (!food) return res.status(404).json({ success: false, message: "Food item not found" });

        // delete image from Cloudinary if it's a Cloudinary URL
        if (food.image && food.image.includes("cloudinary")) {
            try {
                // extract public_id from URL: .../food_delivery/filename.ext
                const parts = food.image.split("/");
                const filename = parts.pop().split(".")[0];
                const folder = parts.pop();
                await cloudinary.uploader.destroy(`${folder}/${filename}`);
            } catch (err) {
                console.log("Failed to delete image from Cloudinary:", err.message);
            }
        }

        await foodModel.findByIdAndDelete(req.body.id);
        res.status(200).json({ success: true, message: "Food item removed successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Failed to remove food item" });
    }
}


export { addFood, listFood, removeFood };
