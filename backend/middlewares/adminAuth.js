import jwt from "jsonwebtoken";

export const adminAuthMiddleware = (req, res, next) => {
    const { token } = req.headers;
    const adminSecret = process.env.ADMIN_SECRET_KEY;
    
    if (!token) {
        return res.status(401).json({ success: false, message: "Admin token not provided" });
    }
    
    if (!adminSecret) {
        return res.status(500).json({ success: false, message: "Admin authentication is not configured" });
    }
    
    try {
        const decoded = jwt.verify(token, adminSecret);
        if (decoded.role !== "admin") {
            return res.status(403).json({ success: false, message: "Unauthorized: Admin access required" });
        }
        req.adminId = decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid or expired admin token" });
    }
};
