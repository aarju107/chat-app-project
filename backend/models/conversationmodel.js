import mongoose from "mongoose";
const conversationModel = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    Messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message"
    }]
}, {timestamps: true});
export default mongoose.model("Conversation", conversationModel);