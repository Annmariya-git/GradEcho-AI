import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import API from "../services/api";

function VerifiedExperiences() {
  const navigate = useNavigate();

  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVerifiedExperiences = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await API.get(
        "/admin/experiences/verified",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setExperiences(response.data.experiences || []);

    } catch (error) {
      console.error(
        "Fetch verified experiences error:",
        error
      );

      if (error.response?.status === 401) {
        alert("Please login again.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }

      if (error.response?.status === 403) {
        alert("Admin access required.");
        navigate("/dashboard");
      }

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifiedExperiences();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="dashboard-page">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <div className="sidebar-logo">

          <div className="logo-small">
            G
          </div>

          <div>
            <h2>GradEcho AI</h2>
            <span>Admin Panel</span>
          </div>

        </div>

        <nav className="sidebar-nav">

          <button
            className="nav-item"
            onClick={() => navigate("/admin")}
          >
            🛡️ <span>Admin Dashboard</span>
          </button>

          <button
            className="nav-item"
            onClick={() => navigate("/companies")}
          >
            🏢 <span>Companies</span>
          </button>

          <button
            className="nav-item active"
          >
            📚 <span>Verified Experiences</span>
          </button>

          <button
            className="nav-item"
            onClick={() => navigate("/manage-users")}
          >
            👥 <span>Manage Users</span>
          </button>

          <button
            className="nav-item"
            onClick={() => navigate("/dashboard")}
          >
            👤 <span>Student View</span>
          </button>

        </nav>

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          🚪 Logout
        </button>

      </aside>

      {/* MAIN CONTENT */}
      <main className="dashboard-main">

        <header className="page-top">

          <div>

            <span className="page-label">
              ADMINISTRATION
            </span>

            <h1>Verified Experiences</h1>

            <p>
              Review placement experiences that have
              been verified and published.
            </p>

          </div>

        </header>

        {/* STAT */}
        <div className="stats-grid">

          <div className="stat-card">

            <span className="stat-icon">
              📚
            </span>

            <div>
              <h3>{experiences.length}</h3>
              <p>Verified Experiences</p>
            </div>

          </div>

          <div className="stat-card">

            <span className="stat-icon">
              🏢
            </span>

            <div>

              <h3>
                {
                  new Set(
                    experiences
                      .map(
                        (experience) =>
                          experience.company?._id
                      )
                      .filter(Boolean)
                  ).size
                }
              </h3>

              <p>Companies</p>

            </div>

          </div>

          <div className="stat-card">

            <span className="stat-icon">
              🤖
            </span>

            <div>
              <h3>RAG</h3>
              <p>AI Knowledge Source</p>
            </div>

          </div>

        </div>

        {/* VERIFIED EXPERIENCES */}
        <section className="form-card">

          <div className="form-section-title">

            <div className="section-icon">
              ✓
            </div>

            <div>
              <h2>Verified Placement Experiences</h2>

              <p>
                These experiences are available in the
                GradEcho AI placement knowledge repository.
              </p>
            </div>

          </div>

          {loading ? (

            <div className="empty-state">
              Loading verified experiences...
            </div>

          ) : experiences.length === 0 ? (

            <div className="empty-state">

              <div style={{ fontSize: "40px" }}>
                📚
              </div>

              <h3>
                No Verified Experiences
              </h3>

              <p>
                Verified placement experiences will
                appear here.
              </p>

            </div>

          ) : (

            <div className="admin-experience-list">

              {experiences.map((experience) => (

                <div
                  className="admin-experience-card"
                  key={experience._id}
                >

                  {/* HEADER */}
                  <div className="admin-experience-header">

                    <div>

                      <span className="status-badge verified">
                        VERIFIED
                      </span>

                      <h3>
                        {experience.company?.name ||
                          "Unknown Company"}
                      </h3>

                      <p>
                        {experience.role ||
                          "Role not specified"}
                      </p>

                    </div>

                  </div>

                  {/* INFORMATION */}
                  <div className="admin-experience-info">

                    <span>
                      🎓 Batch:{" "}
                      {experience.batch ||
                        "Not specified"}
                    </span>

                    <span>
                      📍{" "}
                      {experience.placementType ||
                        "Not specified"}
                    </span>

                    <span>
                      ⚡{" "}
                      {experience.difficulty ||
                        "Not specified"}
                    </span>

                    <span>
                      👤{" "}
                      {experience.contributor?.name ||
                        "Unknown contributor"}
                    </span>

                  </div>

                  {/* EXPERIENCE */}
                  {experience.overallExperience && (

                    <div className="admin-experience-description">

                      <strong>
                        Overall Experience
                      </strong>

                      <p>
                        {experience.overallExperience}
                      </p>

                    </div>

                  )}

                  {/* ROUNDS */}
                  {experience.rounds?.length > 0 && (

                    <div className="admin-rounds">

                      <strong>
                        Interview Rounds
                      </strong>

                      {experience.rounds.map(
                        (round, index) => (

                          <div
                            className="admin-round"
                            key={index}
                          >

                            <div>

                              <strong>
                                Round {index + 1}:{" "}
                                {round.roundType}
                              </strong>

                              {round.description && (

                                <p>
                                  {round.description}
                                </p>

                              )}

                            </div>

                            {round.questions?.length > 0 && (

                              <ul>

                                {round.questions.map(
                                  (question, qIndex) => (

                                    <li key={qIndex}>
                                      {question}
                                    </li>

                                  )
                                )}

                              </ul>

                            )}

                          </div>

                        )
                      )}

                    </div>

                  )}

                  {/* VERIFICATION INFO */}
                  <div className="admin-experience-description">

                    <strong>
                      Verification
                    </strong>

                    <p>
                      Verified by:{" "}
                      {experience.verifiedBy?.name ||
                        "Admin"}
                    </p>

                    {experience.verifiedAt && (

                      <p>
                        Verified on:{" "}
                        {new Date(
                          experience.verifiedAt
                        ).toLocaleDateString()}
                      </p>

                    )}

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default VerifiedExperiences;