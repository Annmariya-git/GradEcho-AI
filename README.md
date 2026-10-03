# GradEcho AI

### AI-Powered Placement Intelligence Network

GradEcho AI is a web-based placement intelligence platform designed to help students prepare for company-specific placement processes using verified placement experiences, AI-powered guidance, preparation tracking, and peer networking.

## 🚀 Features

- 🔐 Secure student authentication
- 🏢 Company-specific placement information
- 📚 Verified placement experience repository
- 🤖 AI Placement Advisor using Gemini API
- 🔎 RAG-based answers using verified placement experiences
- 📝 Student experience sharing
- 🎯 Personalized placement preparation
- 📊 Preparation roadmap and readiness tracking
- 👥 Verified contributor profiles
- 🤝 Student connection requests
- 💬 One-to-one messaging between accepted connections
- 🏅 Contributor verification
- 🛡️ Admin experience verification and management

## 🧠 AI & RAG

The AI Placement Advisor uses the Gemini API to provide placement-related guidance.

The RAG system retrieves relevant **verified placement experiences** from the database and provides them as context to the AI.

The system is designed to distinguish information obtained from verified student experiences from general preparation suggestions.

## 🛠️ Technology Stack

### Frontend
- React.js
- JavaScript
- React Router
- Axios
- CSS

### Backend
- Node.js
- Express.js
- REST APIs

### Database
- MongoDB Atlas
- Mongoose

### Authentication & Security
- JWT
- bcrypt
- Protected API routes
- Role-based admin authorization

### Artificial Intelligence
- Google Gemini API
- Retrieval-Augmented Generation (RAG)

## 📂 Project Structure

```text
GradEcho AI/
│
├── backend/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   └── package.json
│
├── .gitignore
└── README.md