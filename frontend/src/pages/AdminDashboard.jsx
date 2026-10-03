import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import API from "../services/api";

function AdminDashboard() {
  const navigate = useNavigate();

const [experiences, setExperiences] = useState([]);
const [loading, setLoading] = useState(true);
const [actionLoading, setActionLoading] = useState(null);

  const fetchPendingExperiences = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await API.get(
        "/admin/experiences/pending",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setExperiences(response.data.experiences || []);

    } catch (error) {
      console.error("Fetch pending experiences error:", error);

      if (error.response?.status === 401) {
        alert("Please login again.");
        localStorage.removeItem("token");
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
  fetchPendingExperiences();
}, []);

  const verifyExperience = async (id) => {
    try {
      setActionLoading(id);

      const token = localStorage.getItem("token");

      await API.put(
        `/admin/experiences/${id}/verify`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Experience verified successfully.");

      setExperiences((previous) =>
        previous.filter(
          (experience) => experience._id !== id
        )
      );

    } catch (error) {
      console.error("Verify experience error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to verify experience."
      );

    } finally {
      setActionLoading(null);
    }
  };

  const rejectExperience = async (id) => {
    const reason = window.prompt(
      "Enter rejection reason:"
    );

    if (!reason || !reason.trim()) {
      return;
    }

    try {
      setActionLoading(id);

      const token = localStorage.getItem("token");

      await API.put(
        `/admin/experiences/${id}/reject`,
        {
          rejectionReason: reason.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Experience rejected.");

      setExperiences((previous) =>
        previous.filter(
          (experience) => experience._id !== id
        )
      );

    } catch (error) {
      console.error("Reject experience error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to reject experience."
      );

    } finally {
      setActionLoading(null);
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
            <span>Admin Panel</span>
          </div>

        </div>

        <nav className="sidebar-nav">

          <button
            className="nav-item active"
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
  className="nav-item"
  onClick={() => navigate("/verified-experiences")}
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

      {/* Main Content */}

      <main className="dashboard-main">

        <header className="page-top">

          <div>

            <span className="page-label">
              ADMINISTRATION
            </span>

            <h1>Admin Dashboard</h1>

            <p>
              Review and verify placement experiences
              submitted by students.
            </p>

          </div>

        </header>

        {/* Statistics */}

        <div className="stats-grid">

          <div className="stat-card">

            <span className="stat-icon">
              ⏳
            </span>

            <div>
              <h3>{experiences.length}</h3>
              <p>Pending Reviews</p>
            </div>

          </div>

          <div className="stat-card">

            <span className="stat-icon">
              📚
            </span>

            <div>
              <h3>Placement</h3>
              <p>Knowledge Repository</p>
            </div>

          </div>

          <div className="stat-card">

            <span className="stat-icon">
              🤖
            </span>

            <div>
              <h3>AI</h3>
              <p>RAG Intelligence</p>
            </div>

          </div>

        </div>

        {/* Pending Experiences */}

        <section className="form-card">

          <div className="form-section-title">

            <div className="section-icon">
              🔍
            </div>

            <div>

              <h2>Pending Experiences</h2>

              <p>
                Review submissions before making them
                publicly available.
              </p>

            </div>

          </div>

          {loading ? (

            <div className="empty-state">
              Loading pending experiences...
            </div>

          ) : experiences.length === 0 ? (

            <div className="empty-state">

              <div style={{ fontSize: "40px" }}>
                ✅
              </div>

              <h3>No Pending Experiences</h3>

              <p>
                All submitted experiences have been reviewed.
              </p>

            </div>

          ) : (

            <div className="admin-experience-list">

              {experiences.map((experience) => (

                <div
                  className="admin-experience-card"
                  key={experience._id}
                >

                  <div className="admin-experience-header">

                    <div>

                      <span className="status-badge pending">
                        PENDING
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

                  <div className="admin-experience-info">

                    <span>
                      🎓 Batch:{" "}
                      {experience.batch || "Not specified"}
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

                            {round.questions?.length >
                              0 && (

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

                  <div className="admin-actions">

                    <button
                      className="admin-verify-button"
                      disabled={
                        actionLoading === experience._id
                      }
                      onClick={() =>
                        verifyExperience(
                          experience._id
                        )
                      }
                    >
                      {actionLoading === experience._id
                        ? "Processing..."
                        : "✓ Verify Experience"}
                    </button>

                    <button
                      className="admin-reject-button"
                      disabled={
                        actionLoading === experience._id
                      }
                      onClick={() =>
                        rejectExperience(
                          experience._id
                        )
                      }
                    >
                      ✕ Reject
                    </button>

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

export default AdminDashboard;