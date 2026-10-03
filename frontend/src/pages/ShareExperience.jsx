import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import API from "../services/api";

function ShareExperience() {
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    companyName: "",
    role: "",
    batch: "",
    placementType: "on-campus",
    difficulty: "medium",
    overallExperience: "",
  });

  const [rounds, setRounds] = useState([
    {
      roundNumber: 1,
      roundType: "aptitude",
      description: "",
      questions: [""],
    },
  ]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRoundChange = (index, field, value) => {
    const updatedRounds = [...rounds];

    updatedRounds[index][field] = value;

    setRounds(updatedRounds);
  };

  const handleQuestionChange = (
    roundIndex,
    questionIndex,
    value
  ) => {
    const updatedRounds = [...rounds];

    updatedRounds[roundIndex].questions[questionIndex] = value;

    setRounds(updatedRounds);
  };

  const addQuestion = (roundIndex) => {
    const updatedRounds = [...rounds];

    updatedRounds[roundIndex].questions.push("");

    setRounds(updatedRounds);
  };

  const removeQuestion = (roundIndex, questionIndex) => {
    const updatedRounds = [...rounds];

    if (updatedRounds[roundIndex].questions.length === 1) {
      return;
    }

    updatedRounds[roundIndex].questions.splice(questionIndex, 1);

    setRounds(updatedRounds);
  };

  const addRound = () => {
    setRounds([
      ...rounds,
      {
        roundNumber: rounds.length + 1,
        roundType: "technical",
        description: "",
        questions: [""],
      },
    ]);
  };

  const removeRound = (index) => {
    if (rounds.length === 1) {
      return;
    }

    const updatedRounds = rounds
      .filter((_, roundIndex) => roundIndex !== index)
      .map((round, roundIndex) => ({
        ...round,
        roundNumber: roundIndex + 1,
      }));

    setRounds(updatedRounds);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.companyName.trim()) {
      alert("Please enter a company name.");
      return;
    }

    try {
      setSubmitting(true);

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const cleanedRounds = rounds.map((round, index) => ({
        roundNumber: index + 1,
        roundType: round.roundType,
        description: round.description,
        questions: round.questions.filter(
          (question) => question.trim() !== ""
        ),
      }));

      await API.post(
        "/experiences",
        {
          ...formData,
          companyName: formData.companyName.trim(),
          rounds: cleanedRounds,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(
        "Experience submitted successfully! It will be reviewed by an admin."
      );

      navigate("/experiences");
    } catch (error) {
      console.error("Submit experience error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to submit experience."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="dashboard-page">

      {/* Sidebar */}

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

          <button
            className="nav-item"
            onClick={() => navigate("/ai-advisor")}
          >
            🤖 <span>AI Advisor</span>
          </button>

          <button className="nav-item active">
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

      {/* Main Content */}

      <main className="dashboard-main">

        <button
          className="back-button"
          onClick={() => navigate("/experiences")}
        >
          ← Back to Experiences
        </button>

        <header className="page-top">

          <div>

            <span className="page-label">
              GIVE BACK TO THE COMMUNITY
            </span>

            <h1>Share Your Experience</h1>

            <p>
              Help future students prepare by sharing your
              placement journey.
            </p>

          </div>

        </header>

        <form
          className="experience-form"
          onSubmit={handleSubmit}
        >

          {/* Basic Information */}

          <section className="form-card">

            <div className="form-section-title">

              <div className="section-icon">
                🏢
              </div>

              <div>
                <h2>Placement Information</h2>

                <p>
                  Tell us about the company and your placement.
                </p>
              </div>

            </div>

            <div className="form-grid">

              <div className="input-group">

                <label>Company Name *</label>

                <input
                  type="text"
                  name="companyName"
                  placeholder="e.g. TCS, Infosys, Wipro, Accenture"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                />

                <small>
                  Enter the company name exactly as you know it.
                </small>

              </div>

              <div className="input-group">

                <label>Role</label>

                <input
                  type="text"
                  name="role"
                  placeholder="e.g. Software Developer"
                  value={formData.role}
                  onChange={handleChange}
                />

              </div>

              <div className="input-group">

                <label>Batch</label>

                <input
                  type="text"
                  name="batch"
                  placeholder="e.g. 2026"
                  value={formData.batch}
                  onChange={handleChange}
                />

              </div>

              <div className="input-group">

                <label>Placement Type</label>

                <select
                  name="placementType"
                  value={formData.placementType}
                  onChange={handleChange}
                >

                  <option value="on-campus">
                    On Campus
                  </option>

                  <option value="off-campus">
                    Off Campus
                  </option>

                </select>

              </div>

              <div className="input-group">

                <label>Overall Difficulty</label>

                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                >

                  <option value="easy">
                    Easy
                  </option>

                  <option value="medium">
                    Medium
                  </option>

                  <option value="hard">
                    Hard
                  </option>

                </select>

              </div>

            </div>

          </section>

          {/* Interview Rounds */}

          <section className="form-card">

            <div className="form-section-title">

              <div className="section-icon">
                🧩
              </div>

              <div>

                <h2>Interview Rounds</h2>

                <p>
                  Describe each round and the questions asked.
                </p>

              </div>

            </div>

            <div className="form-rounds">

              {rounds.map((round, roundIndex) => (

                <div
                  className="form-round"
                  key={roundIndex}
                >

                  <div className="form-round-header">

                    <div>

                      <span>
                        ROUND {roundIndex + 1}
                      </span>

                      <h3>
                        Interview Round {roundIndex + 1}
                      </h3>

                    </div>

                    {rounds.length > 1 && (
                      <button
                        type="button"
                        className="remove-button"
                        onClick={() =>
                          removeRound(roundIndex)
                        }
                      >
                        Remove
                      </button>
                    )}

                  </div>

                  <div className="input-group">

                    <label>Round Type</label>

                    <select
                      value={round.roundType}
                      onChange={(e) =>
                        handleRoundChange(
                          roundIndex,
                          "roundType",
                          e.target.value
                        )
                      }
                    >

                      <option value="aptitude">
                        Aptitude
                      </option>

                      <option value="coding">
                        Coding
                      </option>

                      <option value="technical">
                        Technical
                      </option>

                      <option value="hr">
                        HR
                      </option>

                      <option value="group-discussion">
                        Group Discussion
                      </option>

                      <option value="other">
                        Other
                      </option>

                    </select>

                  </div>

                  <div className="input-group">

                    <label>Description</label>

                    <textarea
                      placeholder="Describe what happened in this round..."
                      value={round.description}
                      onChange={(e) =>
                        handleRoundChange(
                          roundIndex,
                          "description",
                          e.target.value
                        )
                      }
                      rows="3"
                    />

                  </div>

                  <div className="questions-section">

                    <h4>Questions Asked</h4>

                    {round.questions.map(
                      (question, questionIndex) => (

                        <div
                          className="form-question"
                          key={questionIndex}
                        >

                          <span>
                            {questionIndex + 1}
                          </span>

                          <input
                            type="text"
                            placeholder="Enter interview question"
                            value={question}
                            onChange={(e) =>
                              handleQuestionChange(
                                roundIndex,
                                questionIndex,
                                e.target.value
                              )
                            }
                          />

                          <button
                            type="button"
                            className="question-remove"
                            onClick={() =>
                              removeQuestion(
                                roundIndex,
                                questionIndex
                              )
                            }
                          >
                            ×
                          </button>

                        </div>

                      )
                    )}

                    <button
                      type="button"
                      className="add-question-button"
                      onClick={() =>
                        addQuestion(roundIndex)
                      }
                    >
                      + Add Question
                    </button>

                  </div>

                </div>

              ))}

            </div>

            <button
              type="button"
              className="add-round-button"
              onClick={addRound}
            >
              + Add Another Round
            </button>

          </section>

          {/* Overall Experience */}

          <section className="form-card">

            <div className="form-section-title">

              <div className="section-icon">
                💬
              </div>

              <div>

                <h2>Overall Experience</h2>

                <p>
                  Share useful advice for future students.
                </p>

              </div>

            </div>

            <div className="input-group">

              <label>
                Your Experience
              </label>

              <textarea
                name="overallExperience"
                placeholder="Describe your placement journey, preparation strategy, important tips, and anything future students should know..."
                value={formData.overallExperience}
                onChange={handleChange}
                rows="7"
              />

            </div>

          </section>

          {/* Submit */}

          <div className="form-submit-area">

            <div>
              <strong>
                🔐 Your experience will be reviewed.
              </strong>

              <p>
                An admin will verify your submission before
                it becomes publicly visible.
              </p>
            </div>

            <button
              type="submit"
              className="submit-experience-button"
              disabled={submitting}
            >
              {submitting
                ? "Submitting..."
                : "Submit Experience →"}
            </button>

          </div>

        </form>

      </main>

    </div>
  );
}

export default ShareExperience;