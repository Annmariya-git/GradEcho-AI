const express = require("express");
const { GoogleGenAI } = require("@google/genai");
const protect = require("../middleware/authMiddleware");
const Experience = require("../models/Experience");
const Company = require("../models/Company");

const router = express.Router();

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

// Test route
router.get("/test", (req, res) => {
    res.json({
        success: true,
        message: "AI routes are working"
    });
});

// Ask Gemini
router.post("/ask", protect, async (req, res) => {
    try {
        const { question } = req.body;

const companyNames = await Company.find({
    isActive: true
}).select("_id name");

const mentionedCompany = companyNames.find((company) =>
    question.toLowerCase().includes(company.name.toLowerCase())
);

        const experienceFilter = {
    status: "verified"
};

if (mentionedCompany) {
    experienceFilter.company = mentionedCompany._id;
}

const verifiedExperiences = await Experience.find(experienceFilter)
    .populate("company", "name industry")
    .populate("contributor", "name batch department")
    .limit(20);

    const experienceContext = verifiedExperiences
    .map((experience) => {
        const rounds = experience.rounds
            ?.map((round) => {
                const questions =
                    round.questions?.join(", ") || "No questions recorded";

                return `
Round ${round.roundNumber}: ${round.roundType}
Description: ${round.description || "Not provided"}
Questions: ${questions}
`;
            })
            .join("\n") || "No round information available";

        return `
Company: ${experience.company?.name || "Unknown"}
Industry: ${experience.company?.industry || "Unknown"}
Role: ${experience.role || "Not specified"}
Batch: ${experience.batch || "Not specified"}
Placement Type: ${experience.placementType || "Not specified"}
Difficulty: ${experience.difficulty || "Not specified"}

Interview Rounds:
${rounds}

Overall Experience:
${experience.overallExperience || "Not provided"}
`;
    })
    .join("\n----------------------\n");

        if (!question || !question.trim()) {
            return res.status(400).json({
                success: false,
                message: "Question is required"
            });
        }

        const prompt = `
You are GradEcho AI, an AI-powered placement intelligence advisor for students.

Your job is to help students prepare for placements using the verified placement experiences available in the GradEcho database.

IMPORTANT RULES:
1. Use the verified placement experiences provided below as your primary source for company-specific placement information.
2. Never invent interview questions, rounds, company processes, or placement facts.
3. If the available experiences do not contain enough information to answer a company-specific question, clearly say that the available GradEcho experiences do not contain enough information.
4. You may provide general placement preparation advice when appropriate.
5. Clearly distinguish between information from verified student experiences and general advice.
6. Give practical, beginner-friendly answers.
7. Do not reveal private contributor information such as email addresses.

VERIFIED GRAD ECHO PLACEMENT EXPERIENCES:
${experienceContext}

STUDENT QUESTION:
${question}

Provide a helpful answer based on the information above.
`;
        let response;

try {
    let lastError;

for (let attempt = 1; attempt <= 3; attempt++) {
    try {
        response = await ai.models.generateContent({
            model: "gemini-3.7-flash",
            contents: prompt
        });

        break;
    } catch (error) {
        lastError = error;

        if (error.status === 503 && attempt < 3) {
            const delay = attempt * 2000;
            console.log(`Gemini busy. Retrying in ${delay / 1000} seconds...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        } else {
            throw error;
        }
    }
}

} catch (error) {
    console.error("Gemini API Error:", error.message);

    if (error.status === 429) {
        return res.status(429).json({
            success: false,
            message:
                "Gemini usage limit reached. Please try again after the quota resets."
        });
    }

    if (error.status === 503) {
        return res.status(503).json({
            success: false,
            message:
                "Gemini is temporarily busy. Please try again later."
        });
    }

    throw error;
}

        const answer = response.text;

        res.status(200).json({
            success: true,
            answer
        });

    } catch (error) {
    console.error("Gemini AI Error:", error);

    if (error.status === 429) {
        return res.status(429).json({
            success: false,
            message:
                "AI usage limit reached. Please wait about a minute and try again."
        });
    }

    if (error.status === 503) {
        return res.status(503).json({
            success: false,
            message:
                "Gemini AI is temporarily busy. Please try again in a moment."
        });
    }

    res.status(500).json({
        success: false,
        message: "Failed to generate AI response"
    });
}
});

module.exports = router;