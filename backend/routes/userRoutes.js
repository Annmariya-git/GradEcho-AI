const express = require("express");
const User = require("../models/User");
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");
const router = express.Router();

// ===============================
// GET CURRENT USER PROFILE
// ===============================
router.get("/me", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        console.error("Get User Profile Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});

// ===============================
// UPDATE CURRENT USER PROFILE
// ===============================
router.put("/me", protect, async (req, res) => {
    try {
        const {
            name,
            department,
            batch,
            college,
            profileImage
        } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Update only fields that were provided
        if (name !== undefined) user.name = name;
        if (department !== undefined) user.department = department;
        if (batch !== undefined) user.batch = batch;
        if (college !== undefined) user.college = college;
        if (profileImage !== undefined) user.profileImage = profileImage;

        const updatedUser = await user.save();

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                department: updatedUser.department,
                batch: updatedUser.batch,
                college: updatedUser.college,
                isVerifiedContributor: updatedUser.isVerifiedContributor,
                profileImage: updatedUser.profileImage
            }
        });

    } catch (error) {
        console.error("Update User Profile Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});


// ===============================
// GET CONTRIBUTORS / STUDENTS
// ===============================
router.get("/contributors", protect, async (req, res) => {
    try {
        const users = await User.find({
            _id: { $ne: req.user.id },
            role: "student"
        })
            .select(
                "name email department batch college isVerifiedContributor mentorshipAvailable"
            )
            .sort({ name: 1 });

        res.status(200).json({
            success: true,
            count: users.length,
            users
        });

    } catch (error) {
        console.error("Get Contributors Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error while fetching contributors"
        });
    }
});

// ===============================
// ADMIN - GET ALL USERS
// ===============================
router.get("/", protect, adminOnly, async (req, res) => {
    try {
        const users = await User.find()
            .select("-password")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: users.length,
            users
        });

    } catch (error) {
        console.error("Get All Users Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error while fetching users"
        });
    }
});


// ===============================
// ADMIN - UPDATE CONTRIBUTOR STATUS
// ===============================
router.put("/:id/contributor-status", protect, adminOnly, async (req, res) => {
    try {
        const { isVerifiedContributor } = req.body;

        if (typeof isVerifiedContributor !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "Contributor status must be true or false"
            });
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        user.isVerifiedContributor = isVerifiedContributor;

        await user.save();

        res.status(200).json({
            success: true,
            message: isVerifiedContributor
                ? "User verified as contributor"
                : "Contributor verification removed",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isVerifiedContributor: user.isVerifiedContributor
            }
        });

    } catch (error) {
        console.error("Update Contributor Status Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error while updating contributor status"
        });
    }
});

module.exports = router;