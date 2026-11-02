import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
    let token = req.headers.token || req.headers.authorization;
    if (!token) {
        return res.status(401).json({ success: false, message: "No token provided" });
    }

    if (typeof token === "string" && token.startsWith("Bearer ")) {
        token = token.slice(7).trim();
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        console.error("authMiddleware verification failed:", error.name, error.message);
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                isExpired: true,
                message: "Your session has expired. Please sign in again."
            });
        }
        return res.status(401).json({
            success: false,
            message: "Invalid session token. Please sign in again."
        });
    }

    req.userId = decoded.id;
    if (!req.body) {
        req.body = {};
    }
    req.body.userId = decoded.id;
    next();
};
