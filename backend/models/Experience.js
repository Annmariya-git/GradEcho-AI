const mongoose = require("mongoose");

const experienceSchema = new mongoose.Schema(
    {
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company",
            required: true
        },

        contributor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        role: {
            type: String,
            trim: true
        },

        batch: {
            type: String,
            trim: true
        },

        placementType: {
            type: String,
            enum: ["on-campus", "off-campus"],
            default: "on-campus"
        },

        rounds: [
            {
                roundNumber: {
                    type: Number
                },

                roundType: {
                    type: String,
                    enum: [
                        "aptitude",
                        "coding",
                        "technical",
                        "hr",
                        "group-discussion",
                        "other"
                    ]
                },

                description: {
                    type: String,
                    trim: true
                },

                questions: [
                    {
                        type: String,
                        trim: true
                    }
                ]
            }
        ],

        overallExperience: {
            type: String,
            trim: true
        },

        difficulty: {
            type: String,
            enum: ["easy", "medium", "hard"]
        },

        status: {
            type: String,
            enum: ["pending", "verified", "rejected"],
            default: "pending"
        },

        rejectionReason: {
            type: String,
            trim: true
        },

        verifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

        verifiedAt: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Experience", experienceSchema);