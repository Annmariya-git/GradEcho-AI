import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../index.css";
import API from "../services/api";

function ExperienceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [experience, setExperience] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await API.get(`/experiences/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setExperience(response.data.experience);
      } catch (error) {
        console.error("Failed to load experience:", error);

        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, [id, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="dashboard-page">

        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="logo-small">G</div>

            <div>
              <h2>GradEcho AI</h2>
              <span>Placement Intelligence</span>
            </div>
          </div>
        </aside>

        <main className="dashboard-main">
          <div className="page-state">
            <div className="loading-spinner"></div>
            <p>Loading experience...</p>
          </div>
        </main>

      </div>
    );
  }

  if (!experience) {
    return (
      <div className="dashboard-page">

        <aside className="sidebar">

          <div className="sidebar-logo">
            <div className="logo-small">G</div>

            <div>
              <h2>GradEcho AI</h2>
              <span>Placement Intelligence</span>
            </div>
          </div>

        </aside>

        <main className="dashboard-main">

          <div className="page-state empty-state">

            <div className="empty-icon">📚</div>

            <h2>Experience not found</h2>

            <p>
              This placement experience may no longer be available.
            </p>

            <button
              className="primary-action"
              onClick={() => navigate("/experiences")}
            >
              ← Back to Experiences
            </button>

          </div>

        </main>

      </div>
    );
  }

  return (
    <div className="dashboard-page">

      {/* Sidebar */}
      <aside className="sidebar">

        <div className="sidebar-logo">

          <div className="logo-small">G</div>

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
            className="nav-item active"
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

          <button className="nav-item">
            📝 <span>Share Experience</span>
          </button>

          <button className="nav-item">
            🎯 <span>Preparation</span>
          </button>

          <button className="nav-item">
            👤 <span>My Profile</span>
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

        {/* Back Button */}
        <button
          className="back-button"
          onClick={() => navigate("/experiences")}
        >
          ← Back to Experiences
        </button>

        {/* Company Hero */}
        <section className="experience-hero">

          <div className="hero-company-info">

            <div className="details-company-logo">

              {experience.company?.logo ? (
                <img
                  src={experience.company.logo}
                  alt={experience.company.name}
                />
              ) : (
                experience.company?.name
                  ?.charAt(0)
                  .toUpperCase() || "C"
              )}

            </div>

            <div>

              <span className="page-label">
                VERIFIED PLACEMENT EXPERIENCE
              </span>

              <h1>
                {experience.company?.name || "Company"}
              </h1>

              <p>
                {experience.company?.industry ||
                  "Information Technology"}
              </p>

            </div>

          </div>

          <div className="hero-verified">

            <div className="verified-large">
              ✓
            </div>

            <div>
              <strong>Verified</strong>
              <span>Community Experience</span>
            </div>

          </div>

        </section>

        {/* Placement Information */}
        <section className="details-card">

          <div className="details-section-title">

            <div className="section-icon">
              💼
            </div>

            <div>
              <h2>Placement Information</h2>
              <p>Basic details about this placement.</p>
            </div>

          </div>

          <div className="details-grid">

            <div className="detail-item">

              <span>Role</span>

              <strong>
                {experience.role || "Not specified"}
              </strong>

            </div>

            <div className="detail-item">

              <span>Batch</span>

              <strong>
                {experience.batch || "Not specified"}
              </strong>

            </div>

            <div className="detail-item">

              <span>Placement Type</span>

              <strong>
                {experience.placementType === "on-campus"
                  ? "On Campus"
                  : experience.placementType === "off-campus"
                    ? "Off Campus"
                    : "Not specified"}
              </strong>

            </div>

            <div className="detail-item">

              <span>Difficulty</span>

              <strong className={`difficulty-${experience.difficulty || "none"}`}>
                {experience.difficulty
                  ? experience.difficulty
                      .charAt(0)
                      .toUpperCase() +
                    experience.difficulty.slice(1)
                  : "Not specified"}
              </strong>

            </div>

          </div>

        </section>

        {/* Interview Rounds */}
        <section className="details-card">

          <div className="details-section-title">

            <div className="section-icon">
              🧩
            </div>

            <div>
              <h2>Interview Rounds</h2>
              <p>
                Understand how the placement process was conducted.
              </p>
            </div>

          </div>

          {experience.rounds?.length > 0 ? (

            <div className="professional-rounds">

              {experience.rounds.map((round, index) => (

                <div
                  className="professional-round"
                  key={index}
                >

                  <div className="round-number">
                    {round.roundNumber || index + 1}
                  </div>

                  <div className="round-content">

                    <div className="round-heading">

                      <div>

                        <span className="round-label">
                          ROUND {round.roundNumber || index + 1}
                        </span>

                        <h3>
                          {round.roundType
                            ? round.roundType
                                .replace("-", " ")
                                .replace(/\b\w/g, (letter) =>
                                  letter.toUpperCase()
                                )
                            : "Interview Round"}
                        </h3>

                      </div>

                    </div>

                    {round.description && (
                      <p className="round-description">
                        {round.description}
                      </p>
                    )}

                    {round.questions?.length > 0 && (

                      <div className="questions-section">

                        <h4>
                          Frequently Asked Questions
                        </h4>

                        <div className="question-list">

                          {round.questions.map(
                            (question, questionIndex) => (

                              <div
                                className="question-item"
                                key={questionIndex}
                              >

                                <span>
                                  {questionIndex + 1}
                                </span>

                                <p>
                                  {question}
                                </p>

                              </div>

                            )
                          )}

                        </div>

                      </div>

                    )}

                  </div>

                </div>

              ))}

            </div>

          ) : (

            <div className="no-data-box">
              <span>ℹ️</span>
              <p>No interview round details available.</p>
            </div>

          )}

        </section>

        {/* Overall Experience */}
        <section className="details-card">

          <div className="details-section-title">

            <div className="section-icon">
              💬
            </div>

            <div>
              <h2>Overall Experience</h2>
              <p>
                What the student shared about their placement journey.
              </p>
            </div>

          </div>

          <div className="overall-experience-box">

            <p>
              {experience.overallExperience ||
                "No overall experience description available."}
            </p>

          </div>

        </section>

        {/* Contributor */}
        <section className="details-card">

          <div className="details-section-title">

            <div className="section-icon">
              👤
            </div>

            <div>
              <h2>Shared By</h2>
              <p>Information about the student contributor.</p>
            </div>

          </div>

          <div className="professional-contributor">

            <div className="contributor-avatar">

              {experience.contributor?.name
                ?.charAt(0)
                .toUpperCase() || "S"}

            </div>

            <div className="contributor-details">

              <strong>
                {experience.contributor?.name || "Student"}
              </strong>

              <p>
                {experience.contributor?.department ||
                  "Student"}

                {experience.contributor?.batch && (
                  <>
                    {" "}• Batch{" "}
                    {experience.contributor.batch}
                  </>
                )}
              </p>

              {experience.contributor?.college && (
                <span>
                  🎓 {experience.contributor.college}
                </span>
              )}

              {experience.contributor
                ?.isVerifiedContributor && (

                <div className="verified-contributor">
                  ✓ Verified Contributor
                </div>

              )}

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default ExperienceDetails;