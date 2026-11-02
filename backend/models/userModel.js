import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, default: "" },
    email: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true },
    phone: { type: String, required: true },
    label: { type: String, default: "Home" },
    isDefault: { type: Boolean, default: false }
}, { _id: true });

const userSchema = new mongoose.Schema(
  {
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        default: "",
    },
    cartData: {
        type: Object,
        default: {},
    },
    addresses: {
        type: [addressSchema],
        default: [],
    }
  },
    {
        minimize: false,
        timestamps: true,
    }
);

const UserModel = mongoose.models.User || mongoose.model('User', userSchema);

export default UserModel;
