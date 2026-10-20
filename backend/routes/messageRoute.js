import express from "express";

import {
    sendMessage,
    getMessages,
    getConversation
} from "../controllers/messagecontroller.js";

import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

router.route("/send/:id").post(isAuthenticated, sendMessage);
router.route("/get/:id").get(isAuthenticated, getMessages);
router.route("/conversation/:id").get(isAuthenticated, getConversation);

export default router;
