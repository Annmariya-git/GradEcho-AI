const express = require("express");
const protect = require("../middleware/authMiddleware");
const User = require("../models/User");
const Experience = require("../models/Experience");

const router = express.Router();

router.get("/", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const verifiedExperienceCount = await Experience.countDocuments({
            contributor: user._id,
            status: "verified"
        });

        

        res.status(200).json({
            success: true,
            profile: {
                ...user.toObject(),
                verifiedExperienceCount
            }
        });

    } catch (error) {
        console.error("Profile Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to load profile"
        });
    }
});


// Update mentorship availability
router.put("/mentorship", protect, async (req, res) => {
    try {
        const { mentorshipAvailable } = req.body;

        if (typeof mentorshipAvailable !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "mentorshipAvailable must be true or false."
            });
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { mentorshipAvailable },
            { returnDocument: "after" }
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        res.status(200).json({
            success: true,
            message: "Mentorship availability updated.",
            profile: user
        });

    } catch (error) {
        console.error("Mentorship Update Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update mentorship availability."
        });
    }
});

module.exports = router;