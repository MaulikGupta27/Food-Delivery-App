import "dotenv/config";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import foodModel from "../models/foodModel.js";
import Stripe from "stripe";

const getStripe = () => {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
        throw new Error("STRIPE_SECRET_KEY is not configured in environment variables.");
    }
    return new Stripe(key);
};

// placing user's order from frontend with server-side price calculation
export const placeOrder = async (req, res) => {
    const frontend_url = process.env.FRONTEND_URL || "http://localhost:5173";

    try {
        const userId = req.userId || req.body.userId;
        const { items, address, paymentMethod = "Stripe" } = req.body;

        if (!Array.isArray(items) || items.length === 0 || !address) {
            return res.status(400).json({ success: false, message: "Invalid order payload" });
        }

        // Fetch real items from database to compute tamper-proof prices
        const itemIds = items.map((item) => item._id || item.id).filter(Boolean);
        const dbFoods = await foodModel.find({ _id: { $in: itemIds } });
        const foodMap = new Map(dbFoods.map((f) => [f._id.toString(), f]));

        let subtotal = 0;
        const verifiedItems = [];

        for (const rawItem of items) {
            const rawId = (rawItem._id || rawItem.id || "").toString();
            const food = foodMap.get(rawId);

            if (!food) {
                return res.status(400).json({
                    success: false,
                    message: `Item "${rawItem.name || rawId}" was not found in our catalog.`
                });
            }

            if (food.isAvailable === false) {
                return res.status(400).json({
                    success: false,
                    message: `"${food.name}" is currently out of stock.`
                });
            }

            const quantity = Math.max(1, parseInt(rawItem.quantity, 10) || 1);
            const itemTotal = food.price * quantity;
            subtotal += itemTotal;

            verifiedItems.push({
                _id: food._id,
                name: food.name,
                price: food.price,
                quantity,
                image: food.image,
                category: food.category
            });
        }

        const deliveryFee = 2;
        const totalAmount = subtotal + deliveryFee;

        // Cash on Delivery flow
        if (paymentMethod === "COD") {
            const newOrder = new orderModel({
                userId,
                items: verifiedItems,
                amount: totalAmount,
                address,
                payment: false,
                paymentMethod: "COD",
                status: "Food Preparing"
            });

            await newOrder.save();
            await userModel.findByIdAndUpdate(userId, { cartData: {} });

            return res.status(200).json({
                success: true,
                message: "Order placed successfully with Cash on Delivery",
                orderId: newOrder._id,
                paymentMethod: "COD"
            });
        }

        // Stripe Online Payment flow
        const stripe = getStripe();

        const newOrder = new orderModel({
            userId,
            items: verifiedItems,
            amount: totalAmount,
            address,
            payment: false,
            paymentMethod: "Stripe",
            status: "Food Preparing"
        });

        await newOrder.save();
        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        const line_items = verifiedItems.map((item) => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: item.name
                },
                unit_amount: Math.round(item.price * 100)
            },
            quantity: item.quantity
        }));

        line_items.push({
            price_data: {
                currency: "inr",
                product_data: {
                    name: "Delivery Charges"
                },
                unit_amount: deliveryFee * 100
            },
            quantity: 1
        });

        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: "payment",
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`
        });

        res.status(200).json({ success: true, session_url: session.url, orderId: newOrder._id });
    } catch (error) {
        console.error("placeOrder error:", error.message);
        res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
    }
};

export const verifyOrder = async (req, res) => {
    const { orderId, success } = { ...req.query, ...req.body };
    try {
        if (!orderId) {
            return res.status(400).json({ success: false, message: "orderId is required" });
        }

        const isPaymentSuccess = String(success).toLowerCase() === "true";

        if (isPaymentSuccess) {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            res.status(200).json({ success: true, message: "Order confirmed successfully" });
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.status(200).json({ success: false, message: "Order cancelled due to payment failure" });
        }
    } catch (error) {
        console.error("verifyOrder error:", error.message);
        res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
    }
};

// user orders for frontend
export const userOrders = async (req, res) => {
    try {
        const userId = req.userId || req.body?.userId;
        const orders = await orderModel.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        console.error("userOrders error:", error.message);
        res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
    }
};

// all orders for admin
export const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        console.error("listOrders error:", error.message);
        res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
    }
};

// update order status by admin
export const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        if (!orderId || !status) {
            return res.status(400).json({ success: false, message: "orderId and status are required" });
        }

        const updatedOrder = await orderModel.findByIdAndUpdate(orderId, { status }, { new: true });
        if (!updatedOrder) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        res.status(200).json({ success: true, message: "Order status updated successfully", order: updatedOrder });
    } catch (error) {
        console.error("updateStatus error:", error.message);
        res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
    }
};
