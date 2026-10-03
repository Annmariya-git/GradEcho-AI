const express = require("express");
const protect = require("../middleware/authMiddleware");
const Message = require("../models/message");
const Connection = require("../models/Connection");

const router = express.Router();

// Test route
router.get("/test", (req, res) => {
    res.json({
        success: true,
        message: "Message routes are working"
    });
});

// Send message
router.post("/:connectionId", protect, async (req, res) => {
    try {
        const { message } = req.body;
        const userId = req.user.id;
        const connectionId = req.params.connectionId;

        if (!message || !message.trim()) {
            return res.status(400).json({
                success: false,
                message: "Message is required."
            });
        }

        // Find connection
        const connection = await Connection.findById(connectionId);

        if (!connection) {
            return res.status(404).json({
                success: false,
                message: "Connection not found."
            });
        }

        // Messaging allowed only for accepted connections
        if (connection.status !== "accepted") {
            return res.status(403).json({
                success: false,
                message: "Messaging is available only after the connection is accepted."
            });
        }

        // Check user belongs to this connection
        const isRequester =
            connection.requester.toString() === userId;

        const isRecipient =
            connection.recipient.toString() === userId;

        if (!isRequester && !isRecipient) {
            return res.status(403).json({
                success: false,
                message: "You are not part of this connection."
            });
        }

        // Determine receiver
        const receiverId = isRequester
            ? connection.recipient
            : connection.requester;

        const newMessage = await Message.create({
            sender: userId,
            receiver: receiverId,
            connection: connectionId,
            message: message.trim()
        });

        res.status(201).json({
            success: true,
            message: "Message sent successfully.",
            data: newMessage
        });

    } catch (error) {
        console.error("Send Message Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to send message."
        });
    }
});


// Get messages for an accepted connection
router.get("/:connectionId", protect, async (req, res) => {
    try {
        const userId = req.user.id;
        const connectionId = req.params.connectionId;

        const connection = await Connection.findById(connectionId);

        if (!connection) {
            return res.status(404).json({
                success: false,
                message: "Connection not found."
            });
        }

        // Messaging is allowed only after acceptance
        if (connection.status !== "accepted") {
            return res.status(403).json({
                success: false,
                message: "Messaging is available only after the connection is accepted."
            });
        }

        // Check user belongs to the connection
        const isRequester =
            connection.requester.toString() === userId;

        const isRecipient =
            connection.recipient.toString() === userId;

        if (!isRequester && !isRecipient) {
            return res.status(403).json({
                success: false,
                message: "You are not part of this connection."
            });
        }

        const messages = await Message.find({
            connection: connectionId
        })
            .populate("sender", "name")
            .populate("receiver", "name")
            .sort({ createdAt: 1 });

        res.status(200).json({
            success: true,
            messages
        });

    } catch (error) {
        console.error("Get Messages Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to load messages."
        });
    }
});

module.exports = router;