const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        },

        role: {
            type: String,
            enum: ["student", "admin"],
            default: "student"
        },

        department: {
            type: String,
            trim: true
        },

        batch: {
            type: String,
            trim: true
        },

        college: {
            type: String,
            trim: true
        },

        isVerifiedContributor: {
            type: Boolean,
            default: false
        },

        mentorshipAvailable: {
    type: Boolean,
    default: false
},

        profileImage: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);