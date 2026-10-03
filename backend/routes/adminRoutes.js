const express = require("express");
const Experience = require("../models/Experience");
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();

// GET PENDING PLACEMENT EXPERIENCES
router.get("/experiences/pending", protect, adminOnly, async (req, res) => {
    try {
        const experiences = await Experience.find({
            status: "pending"
        })
            .populate("company", "name industry website logo")
            .populate("contributor", "name email department batch college")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: experiences.length,
            experiences
        });

    } catch (error) {
        console.error("Get Pending Experiences Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});


// VERIFY PLACEMENT EXPERIENCE
router.put("/experiences/:id/verify", protect, adminOnly, async (req, res) => {
    try {
        const experience = await Experience.findById(req.params.id);

        if (!experience) {
            return res.status(404).json({
                success: false,
                message: "Experience not found"
            });
        }

        experience.status = "verified";
        experience.verifiedBy = req.user.id;
        experience.verifiedAt = new Date();

        await experience.save();

        res.status(200).json({
            success: true,
            message: "Experience verified successfully",
            experience
        });

    } catch (error) {
        console.error("Verify Experience Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});


// REJECT PLACEMENT EXPERIENCE
router.put("/experiences/:id/reject", protect, adminOnly, async (req, res) => {
    try {
        const { rejectionReason } = req.body;

        const experience = await Experience.findById(req.params.id);

        if (!experience) {
            return res.status(404).json({
                success: false,
                message: "Experience not found"
            });
        }

        await Experience.updateOne(
    { _id: req.params.id },
    {
        $set: {
            status: "rejected",
            rejectionReason: rejectionReason || "No reason provided",
            verifiedBy: req.user.id,
            verifiedAt: new Date()
        }
    }
);
        res.status(200).json({
            success: true,
            message: "Experience rejected successfully",
            experience
        });

    } catch (error) {
        console.error("Reject Experience Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});


// ===============================
// GET VERIFIED PLACEMENT EXPERIENCES
// ===============================
router.get("/experiences/verified", protect, adminOnly, async (req, res) => {
    try {
        const experiences = await Experience.find({
            status: "verified"
        })
            .populate("company", "name industry website logo")
            .populate("contributor", "name email department batch college")
            .populate("verifiedBy", "name email")
            .sort({ verifiedAt: -1 });

        res.status(200).json({
            success: true,
            count: experiences.length,
            experiences
        });

    } catch (error) {
        console.error("Get Verified Experiences Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error while fetching verified experiences"
        });
    }
});


module.exports = router;