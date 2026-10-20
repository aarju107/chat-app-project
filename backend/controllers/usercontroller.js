import User from "../models/usermodel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const getDefaultAvatar = (gender) => {
    if (gender === "female") return "/avatars/female.svg";
    if (gender === "male") return "/avatars/male.svg";
    return "/avatars/neutral.svg";
};

// ================= REGISTER =================
export const register = async (req, res) => {
    try {
        let {
            fullName,
            username,
            email,
            password,
            confirmPassword,
            gender
        } = req.body;

        fullName = typeof fullName === 'string' ? fullName.trim() : '';
        username = typeof username === 'string' ? username.trim().toLowerCase() : '';
        email = typeof email === 'string' ? email.trim().toLowerCase() : '';

        if (!fullName || !username || !email || !password || !confirmPassword || !gender) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match"
            });
        }

        if (username.length < 3 || !/^[a-z0-9_]+$/.test(username)) {
            return res.status(400).json({ success: false, message: "Username must be 3+ characters using letters, numbers, or underscores" });
        }
        if (password.length < 6) {
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
        }

        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({
                success: false,
                message: "Username already exists"
            });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullName,
            username,
            email,
            password: hashedPassword,
            profilePhoto: getDefaultAvatar(gender),
            gender
        });

        return res.status(201).json({
            success: true,
            message: "User registered successfully"
        });

    } catch (error) {
        console.error("Register error:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};


// ================= LOGIN =================
export const login = async (req, res) => {
    try {
        const username = typeof req.body.username === 'string' ? req.body.username.trim().toLowerCase() : '';
        const { password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Username and password are required"
            });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: "Invalid password" });
        }

        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email
        };

        const token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });

        return res
            .status(200)
            .cookie("token", token, {
                maxAge: 24 * 60 * 60 * 1000,
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax"
            })
            .json({
                success: true,
                _id: user._id,
                fullName: user.fullName,
                username: user.username,
                email: user.email,
                profilePhoto: user.profilePhoto?.includes("api.dicebear.com/9.x/avataaars")
                    ? getDefaultAvatar(user.gender)
                    : user.profilePhoto || getDefaultAvatar(user.gender),
                gender: user.gender,
                message: "Login successful"
            });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};


// ================= LOGOUT =================
export const logout = (req, res) => {
    try {
        return res
            .status(200)
            .clearCookie("token", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" })
            .json({ success: true, message: "Logout successful" });
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};


// ================= GET OTHER USERS =================
export const getOtherUser = async (req, res) => {
    try {
        const loggedUserId = req.id;

        const otherUsers = await User.find({ _id: { $ne: loggedUserId } })
            .select("fullName username profilePhoto gender")
            .sort({ fullName: 1 })
            .lean();

        const usersWithAvatars = otherUsers.map(user => ({
            ...user,
            profilePhoto: user.profilePhoto?.includes("api.dicebear.com/9.x/avataaars")
                ? getDefaultAvatar(user.gender)
                : user.profilePhoto || getDefaultAvatar(user.gender)
        }));

        return res.status(200).json(usersWithAvatars);

    } catch (error) {
        console.error("Get other user error:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};
