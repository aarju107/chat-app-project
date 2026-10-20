import jwt from "jsonwebtoken";

const isAuthenticated = (req, res, next) => {
    try {
        // Get token from cookie
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                message: "User not authenticated"
            });
        }

        // Verify JWT token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET_KEY
        );

        // Store user ID in request
        req.id = decoded.id;

        // Continue to controller
        next();

    } catch (error) {
        console.error("Authentication error:", error);

        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};

export default isAuthenticated;