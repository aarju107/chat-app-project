import Message from "../models/messagemodel.js";
import Conversation from "../models/conversationmodel.js";
import { io, getReceiverSocketId } from "../socket/socket.js";
import mongoose from "mongoose";

// ================= SEND MESSAGE =================
export const sendMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const message = typeof req.body.message === "string" ? req.body.message.trim() : "";

        if (!senderId) {
            return res.status(401).json({ message: "User not authenticated" });
        }
        if (!mongoose.isValidObjectId(receiverId)) {
            return res.status(400).json({ message: "Invalid receiver" });
        }
        if (String(senderId) === String(receiverId)) {
            return res.status(400).json({ message: "You cannot message yourself" });
        }
        if (!message) {
            return res.status(400).json({ message: "Message content is required" });
        }
        if (message.length > 2000) {
            return res.status(400).json({ message: "Messages must be 2000 characters or fewer" });
        }

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId]
            });
        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            message
        });

        conversation.Messages.push(newMessage._id);
        await conversation.save();

        const receiverSocketIds = getReceiverSocketId(receiverId);
        if (receiverSocketIds.length) {
            io.to(receiverSocketIds).emit("newMessage", newMessage);
        }

        return res.status(201).json({ newMessage });

    } catch (error) {
        console.error("Send message error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};


// ================= GET MESSAGES =================
export const getMessages = async (req, res) => {
    try {
        const userId = req.id;
        const receiverId = req.params.id;

        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }
        if (!mongoose.isValidObjectId(receiverId)) {
            return res.status(400).json({ message: "Invalid receiver" });
        }

        const messages = await Message.find({
            $or: [
                { senderId: userId, receiverId: receiverId },
                { senderId: receiverId, receiverId: userId }
            ]
        }).sort({ createdAt: 1 });

        return res.status(200).json(messages);

    } catch (error) {
        console.error("Get messages error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};


// ================= GET CONVERSATION =================
export const getConversation = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;

        if (!senderId) {
            return res.status(401).json({ message: "User not authenticated" });
        }
        if (!mongoose.isValidObjectId(receiverId)) {
            return res.status(400).json({ message: "Invalid receiver" });
        }

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        }).populate("Messages");

        return res.status(200).json({ conversation });

    } catch (error) {
        console.error("Get conversation error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};
