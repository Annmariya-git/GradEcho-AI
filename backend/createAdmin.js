const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./models/User");

dotenv.config({
    path: path.join(__dirname, ".env")
});

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB Connected");

        const email = "admin@gradecho.com";
        const password = "Admin@12345";

        const existingAdmin = await User.findOne({ email });

       if (existingAdmin) {
    const hashedPassword = await bcrypt.hash(password, 10);

    existingAdmin.role = "admin";
    existingAdmin.password = hashedPassword;

    await existingAdmin.save();

    console.log("Existing account changed to admin.");
    console.log("Admin password has been reset.");
} else {
            const hashedPassword = await bcrypt.hash(password, 10);

            const admin = await User.create({
                name: "GradEcho Admin",
                email,
                password: hashedPassword,
                role: "admin",
                department: "MCA",
                batch: "2026",
                college: "GradEcho College"
            });

            console.log("Admin account created successfully.");
            console.log("Email:", admin.email);
            console.log("Password:", password);
        }

        await mongoose.disconnect();

        console.log("MongoDB Disconnected");
        process.exit(0);

    } catch (error) {
        console.error("Create Admin Error:", error);
        process.exit(1);
    }
};

createAdmin();