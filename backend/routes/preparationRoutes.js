const express = require("express");
const Preparation = require("../models/Preparation");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// ===============================
// GET CURRENT STUDENT PREPARATION
// ===============================
router.get("/", protect, async (req, res) => {
    try {
        let preparation = await Preparation.findOne({
            student: req.user.id
        }).populate("targetCompanies", "name industry website logo");

        // Create an empty preparation record if one does not exist
        if (!preparation) {
            preparation = await Preparation.create({
                student: req.user.id,
                targetCompanies: [],
                goals: [],
                skills: [],
                completedTopics: [],
                pendingTopics: [],
                roadmap: [],
                readinessScore: 0
            });

            preparation = await Preparation.findById(preparation._id)
                .populate("targetCompanies", "name industry website logo");
        }

        res.status(200).json({
            success: true,
            preparation
        });

    } catch (error) {
        console.error("Get Preparation Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error while fetching preparation"
        });
    }
});


// ===============================
// CREATE / UPDATE PREPARATION
// ===============================
router.put("/", protect, async (req, res) => {
    try {
        const {
            targetCompanies,
            goals,
            skills,
            completedTopics,
            pendingTopics,
            roadmap,
            readinessScore
        } = req.body;

        let preparation = await Preparation.findOne({
            student: req.user.id
        });

        if (!preparation) {
            preparation = new Preparation({
                student: req.user.id
            });
        }

        if (targetCompanies !== undefined) {
            preparation.targetCompanies = targetCompanies;
        }

        if (goals !== undefined) {
            preparation.goals = goals;
        }

        if (skills !== undefined) {
            preparation.skills = skills;
        }

        if (completedTopics !== undefined) {
            preparation.completedTopics = completedTopics;
        }

        if (pendingTopics !== undefined) {
            preparation.pendingTopics = pendingTopics;
        }

        if (roadmap !== undefined) {
            preparation.roadmap = roadmap;
        }

        if (readinessScore !== undefined) {
            preparation.readinessScore = readinessScore;
        }

        await preparation.save();

        const updatedPreparation = await Preparation.findById(
            preparation._id
        ).populate(
            "targetCompanies",
            "name industry website logo"
        );

        res.status(200).json({
            success: true,
            message: "Preparation plan saved successfully",
            preparation: updatedPreparation
        });

    } catch (error) {
        console.error("Update Preparation Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error while saving preparation"
        });
    }
});


// ===============================
// UPDATE ROADMAP ITEM
// ===============================
router.put("/roadmap/:roadmapId", protect, async (req, res) => {
    try {
        const { completed } = req.body;

        const preparation = await Preparation.findOne({
            student: req.user.id
        });

        if (!preparation) {
            return res.status(404).json({
                success: false,
                message: "Preparation plan not found"
            });
        }

        const roadmapItem = preparation.roadmap.id(
            req.params.roadmapId
        );

        if (!roadmapItem) {
            return res.status(404).json({
                success: false,
                message: "Roadmap item not found"
            });
        }

        roadmapItem.completed = completed;

        await preparation.save();

        res.status(200).json({
            success: true,
            message: "Roadmap progress updated",
            preparation
        });

    } catch (error) {
        console.error("Update Roadmap Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error while updating roadmap"
        });
    }
});

module.exports = router;