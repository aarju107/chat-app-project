import mongoose from "mongoose";

const userModel = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },
        password: {
            type: String,
            required: true
        },
        profilePhoto: {
            type: String,
            default: ""
        },
        gender: {
            type: String,
            enum: ["male", "female", "other"],
            required: true
        }
    },
    { timestamps: true }
);

export default mongoose.model("User", userModel);
