import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");


//  placing user's order from frontend
export const placeOrder = async (req, res) => {
    const frontend_url = process.env.FRONTEND_URL || "http://localhost:5173";

    try {
        const userId = req.userId || req.body.userId;
        const { items, totalAmount, amount, address } = req.body;

        if (!Array.isArray(items) || items.length === 0 || !address) {
            return res.status(400).json({ success: false, message: "Invalid order payload" });
        }

        const orderAmount = Number(totalAmount ?? amount);
        if (Number.isNaN(orderAmount) || orderAmount <= 0) {
            return res.status(400).json({ success: false, message: "Invalid order amount" });
        }

        const newOrder = new orderModel({
            userId,
            items,
            amount: orderAmount,
            address,
        });
        

        await newOrder.save();
        await userModel.findByIdAndUpdate(userId, {cartData: {}});

        const line_items = items.map((item) => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: item.name
                },
                unit_amount: item.price*100
            },
            quantity: item.quantity
        }));

        line_items.push({
            price_data: {
                currency: "inr",
                product_data: {
                    name: "Delivery Charges"
                },
                unit_amount: 2*100
            },
            quantity: 1
        })

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["upi"],
            line_items: line_items,
            mode: "payment",
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`
        })
        
        res.status(200).json({success: true, session_url: session.url});
    } catch (error) {
        console.error("placeOrder error:", error.message);
        res.status(500).json({success: false, message: error.message || "Internal Server Error"});
    }
}

export const verifyOrder = async (req, res) => {
    const { orderId, success } = { ...req.query, ...req.body };
    try {
        if (!orderId) {
            return res.status(400).json({ success: false, message: "orderId is required" });
        }

        const isPaymentSuccess = String(success).toLowerCase() === "true";

        if(isPaymentSuccess) {
            await orderModel.findByIdAndUpdate(orderId, {payment: true});
            res.status(200).json({success: true, message: "Order confirmed successfully"});
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.status(200).json({success: false, message: "Order cancelled successfully"});
        }
    } catch(error) {
        console.error("verifyOrder error:", error.message);
        res.status(500).json({success: false, message: error.message || "Internal Server Error"});
    }
}

// user orders for frontend
export const userOrders = async (req, res) => {
    try {
        const userId = req.userId || req.body.userId;
        const orders = await orderModel.find({userId}).sort({createdAt: -1});
        res.status(200).json({success: true, data: orders});
    } catch(error) {
        console.error("userOrders error:", error.message);
        res.status(500).json({success: false, message: error.message || "Internal Server Error"});
    }
}

// all orders for admin
export const listOrders = async (req, res) => {
    try{
        const orders = await orderModel.find().sort({createdAt: -1});
        res.status(200).json({success: true, data: orders});
    } catch(error) {
        console.error("listOrders error:", error.message);
        res.status(500).json({success: false, message: error.message || "Internal Server Error"});
    }
}

// update order status by admin
export const updateStatus = async(req, res) => {
    try {
        const { orderId, status } = req.body;
        if (!orderId || !status) {
            return res.status(400).json({ success: false, message: "orderId and status are required" });
        }

        const updatedOrder = await orderModel.findByIdAndUpdate(orderId, { status }, { new: true });
        if (!updatedOrder) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        res.status(200).json({success: true, message: "Order status updated successfully"});
    } catch (error) {
        console.error("updateStatus error:", error.message);
        res.status(500).json({success: false, message: error.message || "Internal Server Error"});
    }
}