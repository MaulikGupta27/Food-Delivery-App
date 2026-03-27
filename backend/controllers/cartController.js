import userModel from "../models/userModel.js";

// add items to user cart
export const addToCart = async (req, res) => {
    try {
        if (!req.body.itemId || typeof req.body.itemId !== "string") {
            return res.status(400).json({ success: false, message: "Invalid itemId" });
        }

        const userData = await userModel.findById(req.body.userId);
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const cartData = userData.cartData;
        if(!cartData[req.body.itemId]) {
            cartData[req.body.itemId] = 1;
        } else {
            cartData[req.body.itemId] += 1;
        }
        await userModel.findByIdAndUpdate(req.body.userId, { cartData });
        return res.status(200).json({ success: true, message: "Item added to cart", cartData });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
}


// remove items from user cart
export const removeFromCart = async (req, res) => {
    try {
        if (!req.body.itemId || typeof req.body.itemId !== "string") {
            return res.status(400).json({ success: false, message: "Invalid itemId" });
        }

        const userData = await userModel.findById(req.body.userId);
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const cartData = userData.cartData;
        if(cartData[req.body.itemId]>0) {
            cartData[req.body.itemId] -= 1;
        }
        await userModel.findByIdAndUpdate(req.body.userId, { cartData });
        return res.status(200).json({ success: true, message: "Item removed from cart", cartData });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
}


// fetch user cart data
export const getCart = async (req, res) => {
    try {
        const userData = await userModel.findById(req.body.userId);
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const cartData = userData.cartData;
        return res.status(200).json({ success: true, cartData });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error" });
    } 
}