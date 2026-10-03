const path = require("path");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const profileRoutes = require("./routes/profileRoutes");

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();

// Global Middleware
app.use(cors());
app.use(express.json());

// Database connection
if (process.env.MONGO_URI) {
  connectDB();
} else {
  console.log("Waiting for MONGO_URI in .env to connect to MongoDB Atlas...");
}

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "GradEcho AI Backend API is running!",
    version: "1.0.0",
    modules: [
      "Authentication",
      "Placement Knowledge Repository",
      "AI Placement Intelligence & RAG",
      "Contributor & Mentorship Network",
      "Student Preparation System",
      "Admin Verification",
    ],
  });
});

// REST API Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/companies", require("./routes/companyRoutes"));
app.use("/api/experiences", require("./routes/experienceRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/preparation", require("./routes/preparationRoutes"));
app.use("/api/connections", require("./routes/connectionRoutes"));
app.use("/api/messages", require("./routes/messageRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));
app.use("/api/profile", profileRoutes);


// 404 Handler for undefined routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API Route ${req.originalUrl} not found`,
  });
});

// Central Error Handler
app.use((err, req, res, next) => {
  console.error("Internal Server Error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "production" ? null : err.message,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`GradEcho AI Server running on port ${PORT}`);
});