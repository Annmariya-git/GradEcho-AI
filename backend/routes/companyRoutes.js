const express = require("express");
const Company = require("../models/Company");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// ===============================
// GET ALL COMPANIES
// ===============================
router.get("/", protect, async (req, res) => {
    try {
        const companies = await Company.find({ isActive: true })
            .sort({ name: 1 });

        res.status(200).json({
            success: true,
            count: companies.length,
            companies
        });

    } catch (error) {
        console.error("Get Companies Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});

// ===============================
// GET SINGLE COMPANY
// ===============================
router.get("/:id", protect, async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);

        if (!company || !company.isActive) {
            return res.status(404).json({
                success: false,
                message: "Company not found"
            });
        }

        res.status(200).json({
            success: true,
            company
        });

    } catch (error) {
        console.error("Get Company Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});

// ===============================
// CREATE COMPANY
// ===============================
router.post("/", protect, async (req, res) => {
    try {
        const {
            name,
            description,
            industry,
            website,
            logo
        } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Company name is required"
            });
        }

        const existingCompany = await Company.findOne({
            name: name.trim()
        });

        if (existingCompany) {
            return res.status(400).json({
                success: false,
                message: "Company already exists"
            });
        }

        const company = await Company.create({
            name,
            description,
            industry,
            website,
            logo
        });

        res.status(201).json({
            success: true,
            message: "Company created successfully",
            company
        });

    } catch (error) {
        console.error("Create Company Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});

// ===============================
// UPDATE COMPANY
// ===============================
router.put("/:id", protect, async (req, res) => {
    try {
        const {
            name,
            description,
            industry,
            website,
            logo,
            isActive
        } = req.body;

        const company = await Company.findById(req.params.id);

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found"
            });
        }

        if (name !== undefined) company.name = name;
        if (description !== undefined) company.description = description;
        if (industry !== undefined) company.industry = industry;
        if (website !== undefined) company.website = website;
        if (logo !== undefined) company.logo = logo;
        if (isActive !== undefined) company.isActive = isActive;

        const updatedCompany = await company.save();

        res.status(200).json({
            success: true,
            message: "Company updated successfully",
            company: updatedCompany
        });

    } catch (error) {
        console.error("Update Company Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});

module.exports = router;


