const express = require("express");
const protect = require("../middleware/authMiddleware");
const Connection = require("../models/Connection");
const User = require("../models/User");

const router = express.Router();

// Test route
router.get("/test", (req, res) => {
    res.json({
        success: true,
        message: "Connection routes are working"
    });
});

// Send connection request
router.post("/request/:userId", protect, async (req, res) => {
    try {
        const requesterId = req.user.id;
        const recipientId = req.params.userId;
        const { message } = req.body;

        // Prevent sending request to yourself
        if (requesterId === recipientId) {
            return res.status(400).json({
                success: false,
                message: "You cannot send a connection request to yourself."
            });
        }

        // Check recipient exists
        const recipient = await User.findById(recipientId);

        if (!recipient) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        // Check existing connection in either direction
        const existingConnection = await Connection.findOne({
            $or: [
                {
                    requester: requesterId,
                    recipient: recipientId
                },
                {
                    requester: recipientId,
                    recipient: requesterId
                }
            ]
        });

        if (existingConnection) {
            return res.status(400).json({
                success: false,
                message: `Connection already exists with status: ${existingConnection.status}`
            });
        }

        const connection = await Connection.create({
            requester: requesterId,
            recipient: recipientId,
            message: message || "",
            status: "pending"
        });

        res.status(201).json({
            success: true,
            message: "Connection request sent successfully.",
            connection
        });

    } catch (error) {
        console.error("Send Connection Request Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to send connection request."
        });
    }
});



// Accept connection request
router.put("/accept/:connectionId", protect, async (req, res) => {
    try {
        const connection = await Connection.findById(
            req.params.connectionId
        );

        if (!connection) {
            return res.status(404).json({
                success: false,
                message: "Connection request not found."
            });
        }

        // Only the recipient can accept
        if (connection.recipient.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to accept this request."
            });
        }

        connection.status = "accepted";
        await connection.save();

        res.status(200).json({
            success: true,
            message: "Connection request accepted.",
            connection
        });

    } catch (error) {
        console.error("Accept Connection Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to accept connection request."
        });
    }
});

// Reject connection request
router.put("/reject/:connectionId", protect, async (req, res) => {
    try {
        const connection = await Connection.findById(
            req.params.connectionId
        );

        if (!connection) {
            return res.status(404).json({
                success: false,
                message: "Connection request not found."
            });
        }

        // Only the recipient can reject
        if (connection.recipient.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to reject this request."
            });
        }

        connection.status = "rejected";
        await connection.save();

        res.status(200).json({
            success: true,
            message: "Connection request rejected.",
            connection
        });

    } catch (error) {
        console.error("Reject Connection Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to reject connection request."
        });
    }
});


// Get my connections
router.get("/", protect, async (req, res) => {
    try {
        const connections = await Connection.find({
            $or: [
                { requester: req.user.id },
                { recipient: req.user.id }
            ]
        })
            .populate("requester", "name email department batch isVerifiedContributor")
            .populate("recipient", "name email department batch isVerifiedContributor")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            connections
        });

    } catch (error) {
        console.error("Get Connections Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to load connections."
        });
    }
});


module.exports = router;