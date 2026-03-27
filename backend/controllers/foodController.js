import foodModel from "../models/foodModel.js";
import fs from "fs";

// add food item to database
const addFood = async(req, res)=> {
    let image_filename= `${req.file.filename}`;
    const food = new foodModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: image_filename
    })
    try {
        await food.save();
        res.status(201).json({ success: true, message: "Food item added successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Failed to add food item" });
    }
}

// list all food items from database
const listFood = async(req, res)=> {
    try {
        const foods = await foodModel.find({});
        res.status(200).json({ success: true, data: foods });
    } catch(error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Failed to fetch food items" });
    }
}

// remove food item from database
const removeFood = async(req, res)=> {
    try {
        const food = await foodModel.findById(req.body.id);
        if (!food) return res.status(404).json({ success: false, message: "Food item not found" });
        
        // delete image file from uploads folder
        try {
            await fs.promises.unlink(`uploads/${food.image}`);
        } catch (err) {
            console.log("Failed to delete image file:", err.message);
        }
        await foodModel.findByIdAndDelete(req.body.id);
        res.status(200).json({ success: true, message: "Food item removed successfully" });
    } catch(error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Failed to remove food item" });
    }
}


export { addFood, listFood, removeFood };
