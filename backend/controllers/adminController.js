import jwt from "jsonwebtoken";

export const adminLogin = async (req, res) => {
    const { password } = req.body;
    const adminSecret = process.env.ADMIN_SECRET_KEY;
    const adminPassword = process.env.ADMIN_PASSWORD;

    try {
        if (!adminSecret || !adminPassword) {
            return res.status(500).json({ success: false, message: "Admin credentials are not configured" });
        }

        if (!password) {
            return res.status(400).json({ success: false, message: "Password is required" });
        }

        if (password !== adminPassword) {
            return res.status(401).json({ success: false, message: "Invalid admin password" });
        }

        const token = jwt.sign(
            { id: "admin", role: "admin" },
            adminSecret,
            { expiresIn: "7d" }
        );

        res.status(200).json({
            success: true,
            message: "Admin login successful",
            token
        });
    } catch (error) {
        console.error("adminLogin error:", error.message);
        res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
    }
};

export const adminLogout = (req, res) => {
    res.status(200).json({ success: true, message: "Admin logout successful" });
};
