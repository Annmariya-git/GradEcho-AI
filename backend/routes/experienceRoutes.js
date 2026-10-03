const express = require("express");
const Experience = require("../models/Experience");
const Company = require("../models/Company");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// CREATE PLACEMENT EXPERIENCE
router.post("/", protect, async (req, res) => {
    try {
        const {
            company,
            companyName,
            role,
            batch,
            placementType,
            rounds,
            overallExperience,
            difficulty
        } = req.body;

        // Company name is required
        if (!companyName || !companyName.trim()) {
            return res.status(400).json({
                success: false,
                message: "Company name is required"
            });
        }

        const cleanCompanyName = companyName.trim();

        // Check whether company already exists
        let existingCompany = await Company.findOne({
            name: {
                $regex: new RegExp(`^${cleanCompanyName}$`, "i")
            }
        });

        // If company doesn't exist, create it
        if (!existingCompany) {
            existingCompany = await Company.create({
                name: cleanCompanyName,
                description: "",
                industry: "",
                website: "",
                logo: "",
                isActive: true
            });
        }

        // Create placement experience
        const experience = await Experience.create({
            company: existingCompany._id,
            contributor: req.user.id,
            role,
            batch,
            placementType,
            rounds,
            overallExperience,
            difficulty,
            status: "pending"
        });

        res.status(201).json({
            success: true,
            message: "Placement experience submitted successfully. It will be reviewed by an admin.",
            experience
        });

    } catch (error) {
        console.error("Create Experience Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});

// GET VERIFIED PLACEMENT EXPERIENCES
router.get("/", protect, async (req, res) => {
    try {
        const experiences = await Experience.find({
            status: "verified"
        })
        .populate("company", "name industry website logo")
        .populate("contributor", "name department batch college isVerifiedContributor")
        .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: experiences.length,
            experiences
        });

    } catch (error) {
        console.error("Get Experiences Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});

// GET SINGLE VERIFIED PLACEMENT EXPERIENCE
router.get("/:id", protect, async (req, res) => {
    try {
        const experience = await Experience.findOne({
            _id: req.params.id,
            status: "verified"
        })
            .populate("company", "name industry website logo")
            .populate(
                "contributor",
                "name department batch college isVerifiedContributor"
            );

        if (!experience) {
            return res.status(404).json({
                success: false,
                message: "Verified experience not found"
            });
        }

        res.status(200).json({
            success: true,
            experience
        });

    } catch (error) {
        console.error("Get Experience Details Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});

module.exports = router;