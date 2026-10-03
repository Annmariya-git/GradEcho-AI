import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import API from "../services/api";

function AIAdvisor() {
  const navigate = useNavigate();

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async (e) => {
    e.preventDefault();

    if (!question.trim()) {
      alert("Please enter a question.");
      return;
    }

    try {
      setLoading(true);
      setAnswer("");

      const token = localStorage.getItem("token");

      const response = await API.post(
        "/ai/ask",
        {
          question: question.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAnswer(
        response.data.answer ||
        "No answer was generated."
      );

    } catch (error) {
      console.error("AI Advisor error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      setAnswer(
        error.response?.data?.message ||
        "Unable to get an AI response."
      );

    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="dashboard-page">

      <aside className="sidebar">

        <div className="sidebar-logo">

          <div className="logo-small">
            G
          </div>

          <div>
            <h2>GradEcho AI</h2>
            <span>Placement Intelligence</span>
          </div>

        </div>

        <nav className="sidebar-nav">

          <button
            className="nav-item"
            onClick={() => navigate("/dashboard")}
          >
            🏠 <span>Dashboard</span>
          </button>

          <button
            className="nav-item"
            onClick={() => navigate("/companies")}
          >
            🏢 <span>Companies</span>
          </button>

          <button
            className="nav-item"
            onClick={() => navigate("/experiences")}
          >
            📚 <span>Experiences</span>
          </button>

          <button className="nav-item active">
            🤖 <span>AI Advisor</span>
          </button>

          <button
            className="nav-item"
            onClick={() => navigate("/share-experience")}
          >
            📝 <span>Share Experience</span>
          </button>

          <button
  type="button"
  className="nav-item"
  onClick={() => navigate("/preparation")}
>
  🎯 <span>Preparation</span>
</button>

<button
  type="button"
  className="nav-item"
  onClick={() => navigate("/profile")}
>
  👤 <span>My Profile</span>
</button>

<button
  className="nav-item"
  onClick={() => navigate("/connections")}
>
  🤝 <span>Connections</span>
</button>


<button
  className="nav-item"
  onClick={() => navigate("/contributors")}
>
  👥 <span>Contributors</span>
</button>


        </nav>

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          🚪 Logout
        </button>

      </aside>

      <main className="dashboard-main">

        <header className="page-top">

          <div>

            <span className="page-label">
              AI-POWERED PLACEMENT SUPPORT
            </span>

            <h1>AI Placement Advisor</h1>

            <p>
              Get personalized guidance for your placement preparation.
            </p>

          </div>

        </header>

        <section className="ai-advisor-container">

          <div className="ai-intro-card">

            <div className="ai-icon-large">
              🤖
            </div>

            <div>
              <h2>
                Ask GradEcho AI
              </h2>

              <p>
                Ask questions about interviews, aptitude,
                coding, technical rounds, resumes and
                placement preparation.
              </p>
            </div>

          </div>

          <form
            className="ai-question-form"
            onSubmit={handleAsk}
          >

            <div className="input-group">

              <label>
                Your Question
              </label>

              <textarea
                value={question}
                onChange={(e) =>
                  setQuestion(e.target.value)
                }
                placeholder="Example: How should I prepare for a TCS technical interview?"
                rows="5"
              />

            </div>

            <button
              type="submit"
              className="ai-ask-button"
              disabled={loading}
            >
              {loading
                ? "Thinking..."
                : "Ask GradEcho AI →"}
            </button>

          </form>

          {loading && (
            <div className="ai-response-card">

              <div className="ai-response-header">

                <div className="ai-response-icon">
                  🤖
                </div>

                <div>
                  <h3>GradEcho AI</h3>
                  <span>Generating response...</span>
                </div>

              </div>

              <div className="ai-loading">
                <div className="loading-spinner"></div>
                <p>
                  Analyzing your question...
                </p>
              </div>

            </div>
          )}

          {!loading && answer && (
            <div className="ai-response-card">

              <div className="ai-response-header">

                <div className="ai-response-icon">
                  🤖
                </div>

                <div>
                  <h3>GradEcho AI</h3>
                  <span>Placement Intelligence Assistant</span>
                </div>

              </div>

              <div className="ai-answer">

  {answer.split("\n").map((line, index) => (
    <p key={index}>
      {line || "\u00A0"}
    </p>
  ))}

</div>

            </div>
          )}

          {!answer && !loading && (
            <div className="ai-suggestions">

              <h3>
                Try asking
              </h3>

              <div className="suggestion-grid">

                <button
                  onClick={() =>
                    setQuestion(
                      "How should I prepare for a technical interview?"
                    )
                  }
                >
                  💻 Technical Interview
                </button>

                <button
                  onClick={() =>
                    setQuestion(
                      "What topics should I study for aptitude tests?"
                    )
                  }
                >
                  🧮 Aptitude Preparation
                </button>

                <button
                  onClick={() =>
                    setQuestion(
                      "How can I improve my coding interview preparation?"
                    )
                  }
                >
                  👨‍💻 Coding Preparation
                </button>

                <button
                  onClick={() =>
                    setQuestion(
                      "What are the common HR interview questions?"
                    )
                  }
                >
                  💬 HR Interview
                </button>

              </div>

            </div>
          )}

        </section>

      </main>

    </div>
  );
}

export default AIAdvisor;