import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    items: {
        type: Array,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    address: {
        type: Object,
        required: true
    },
    status: {
        type: String,
        default: "Food Preparing"
    },
    date: {
        type: Date,
        default: Date.now
    },
    payment: {
        type: Boolean,
        default: false
    },
    paymentMethod: {
        type: String,
        enum: ["Stripe", "COD"],
        default: "Stripe"
    }
}, { timestamps: true });

const orderModel = mongoose.models.orders || mongoose.model("orders", orderSchema);

export default orderModel;
