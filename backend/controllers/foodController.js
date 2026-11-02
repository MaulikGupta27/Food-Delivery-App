import foodModel from "../models/foodModel.js";
import cloudinary from "../config/cloudinary.js";

// Helper to upload buffer to Cloudinary
const uploadBufferToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: "food_delivery" },
            (error, result) => {
                if (error) return reject(error);
                return resolve(result);
            }
        );
        stream.end(buffer);
    });
};

// add food item to database
const addFood = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Food image is required" });
        }

        const result = await uploadBufferToCloudinary(req.file.buffer);

        const isVeg = req.body.isVeg !== undefined ? String(req.body.isVeg) === "true" : true;
        const isAvailable = req.body.isAvailable !== undefined ? String(req.body.isAvailable) === "true" : true;

        const food = new foodModel({
            name: req.body.name,
            description: req.body.description,
            price: Number(req.body.price),
            category: req.body.category,
            image: result.secure_url,
            isVeg,
            isAvailable,
            rating: Number(req.body.rating) || 4.5
        });

        await food.save();
        res.status(201).json({ success: true, message: "Food item added successfully", data: food });
    } catch (error) {
        console.error("addFood error:", error);
        res.status(500).json({ success: false, message: "Failed to add food item: " + error.message });
    }
};

// update food item
const updateFood = async (req, res) => {
    try {
        const { id } = req.params;
        const food = await foodModel.findById(id);
        if (!food) {
            return res.status(404).json({ success: false, message: "Food item not found" });
        }

        const updateData = {};
        if (req.body.name) updateData.name = req.body.name;
        if (req.body.description) updateData.description = req.body.description;
        if (req.body.price !== undefined) updateData.price = Number(req.body.price);
        if (req.body.category) updateData.category = req.body.category;
        if (req.body.isVeg !== undefined) updateData.isVeg = String(req.body.isVeg) === "true";
        if (req.body.isAvailable !== undefined) updateData.isAvailable = String(req.body.isAvailable) === "true";
        if (req.body.rating !== undefined) updateData.rating = Number(req.body.rating);

        // If new image uploaded
        if (req.file) {
            const result = await uploadBufferToCloudinary(req.file.buffer);
            updateData.image = result.secure_url;

            // Delete old Cloudinary image if present
            if (food.image && food.image.includes("cloudinary")) {
                try {
                    const parts = food.image.split("/");
                    const filename = parts.pop().split(".")[0];
                    const folder = parts.pop();
                    await cloudinary.uploader.destroy(`${folder}/${filename}`);
                } catch (err) {
                    console.log("Old image cleanup error:", err.message);
                }
            }
        }

        const updated = await foodModel.findByIdAndUpdate(id, updateData, { new: true });
        res.status(200).json({ success: true, message: "Food item updated successfully", data: updated });
    } catch (error) {
        console.error("updateFood error:", error);
        res.status(500).json({ success: false, message: "Failed to update food item: " + error.message });
    }
};

// toggle food item availability (In Stock / Out of Stock)
const toggleAvailability = async (req, res) => {
    try {
        const { id } = req.params;
        const food = await foodModel.findById(id);
        if (!food) {
            return res.status(404).json({ success: false, message: "Food item not found" });
        }

        food.isAvailable = !food.isAvailable;
        await food.save();

        res.status(200).json({
            success: true,
            message: `Item marked as ${food.isAvailable ? "In Stock" : "Out of Stock"}`,
            isAvailable: food.isAvailable
        });
    } catch (error) {
        console.error("toggleAvailability error:", error);
        res.status(500).json({ success: false, message: "Failed to toggle availability" });
    }
};

// list all food items from database
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({}).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: foods });
    } catch (error) {
        console.error("listFood error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch food items" });
    }
};

// remove food item from database
const removeFood = async (req, res) => {
    try {
        const food = await foodModel.findById(req.body.id);
        if (!food) return res.status(404).json({ success: false, message: "Food item not found" });

        // delete image from Cloudinary if it's a Cloudinary URL
        if (food.image && food.image.includes("cloudinary")) {
            try {
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
        console.error("removeFood error:", error);
        res.status(500).json({ success: false, message: "Failed to remove food item" });
    }
};

export { addFood, updateFood, toggleAvailability, listFood, removeFood };
