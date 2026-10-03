const mongoose = require("mongoose");

const preparationSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        targetCompanies: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Company"
            }
        ],

        goals: [
            {
                type: String,
                trim: true
            }
        ],

        skills: [
            {
                type: String,
                trim: true
            }
        ],

        completedTopics: [
            {
                type: String,
                trim: true
            }
        ],

        pendingTopics: [
            {
                type: String,
                trim: true
            }
        ],

        roadmap: [
            {
                title: {
                    type: String,
                    trim: true
                },

                description: {
                    type: String,
                    trim: true
                },

                priority: {
                    type: String,
                    enum: ["low", "medium", "high"],
                    default: "medium"
                },

                completed: {
                    type: Boolean,
                    default: false
                }
            }
        ],

        readinessScore: {
            type: Number,
            min: 0,
            max: 100,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Preparation", preparationSchema);