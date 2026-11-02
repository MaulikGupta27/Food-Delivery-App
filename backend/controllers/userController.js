import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import validator from 'validator';

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// login user
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide email and password' });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        const token = createToken(user._id);
        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone || ""
            }
        });
    } catch (error) {
        console.error("loginUser error:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// register user
export const registerUser = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide name, email and password' });
        }

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: 'Please provide a valid email' });
        }
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
            phone: phone || ""
        });
        const user = await newUser.save();

        const token = createToken(user._id);

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone || ""
            },
            message: 'User registered successfully'
        });
    } catch (error) {
        console.error("registerUser error:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// get user profile
export const getProfile = async (req, res) => {
    try {
        const userId = req.userId || req.body.userId;
        const user = await userModel.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.error("getProfile error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// update user profile
export const updateProfile = async (req, res) => {
    try {
        const userId = req.userId || req.body.userId;
        const { name, phone } = req.body;

        const updateData = {};
        if (name && name.trim()) updateData.name = name.trim();
        if (phone !== undefined) updateData.phone = phone.trim();

        const updatedUser = await userModel.findByIdAndUpdate(userId, updateData, { new: true }).select("-password");
        res.status(200).json({ success: true, message: "Profile updated successfully", data: updatedUser });
    } catch (error) {
        console.error("updateProfile error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// add address
export const addAddress = async (req, res) => {
    try {
        const userId = req.userId || req.body.userId;
        const { firstName, lastName, email, street, city, state, zipCode, country, phone, label, isDefault } = req.body;

        if (!street || !city || !state || !zipCode || !phone) {
            return res.status(400).json({ success: false, message: "Required address fields are missing" });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (isDefault) {
            user.addresses.forEach(addr => { addr.isDefault = false; });
        }

        const newAddress = {
            firstName: firstName || user.name.split(" ")[0] || "User",
            lastName: lastName || "",
            email: email || user.email,
            street,
            city,
            state,
            zipCode,
            country: country || "India",
            phone,
            label: label || "Home",
            isDefault: isDefault || user.addresses.length === 0
        };

        user.addresses.push(newAddress);
        await user.save();

        res.status(201).json({ success: true, message: "Address added successfully", data: user.addresses });
    } catch (error) {
        console.error("addAddress error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// delete address
export const deleteAddress = async (req, res) => {
    try {
        const userId = req.userId || req.body.userId;
        const { addressId } = req.params;

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        user.addresses = user.addresses.filter(addr => addr._id.toString() !== addressId);
        await user.save();

        res.status(200).json({ success: true, message: "Address deleted successfully", data: user.addresses });
    } catch (error) {
        console.error("deleteAddress error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// change password
export const changePassword = async (req, res) => {
    try {
        const userId = req.userId || req.body.userId;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ success: false, message: "Both current and new passwords are required" });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ success: false, message: "New password must be at least 8 characters long" });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Current password is incorrect" });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.status(200).json({ success: true, message: "Password updated successfully" });
    } catch (error) {
        console.error("changePassword error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
