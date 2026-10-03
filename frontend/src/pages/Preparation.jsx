import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import API from "../services/api";

function Preparation() {
  const navigate = useNavigate();

  const [preparation, setPreparation] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [goals, setGoals] = useState("");
  const [skills, setSkills] = useState("");
  const [completedTopics, setCompletedTopics] = useState("");
  const [pendingTopics, setPendingTopics] = useState("");
  const [readinessScore, setReadinessScore] = useState(0);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [roadmap, setRoadmap] = useState([]);

  // Fetch preparation data and companies when the page loads
  useEffect(() => {
    fetchPreparation();
    fetchCompanies();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return null;
    }

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // Fetch the student's preparation plan
  const fetchPreparation = async () => {
    try {
      const auth = getAuthHeaders();

      if (!auth) return;

      const response = await API.get("/preparation", auth);
      const data = response.data.preparation;

      setPreparation(data);

      setGoals(data.goals?.join(", ") || "");
      setSkills(data.skills?.join(", ") || "");
      setCompletedTopics(data.completedTopics?.join(", ") || "");
      setPendingTopics(data.pendingTopics?.join(", ") || "");

      setReadinessScore(data.readinessScore ?? 0);

      setSelectedCompanies(
        data.targetCompanies?.map((company) => company._id) || []
      );

      setRoadmap(data.roadmap || []);
    } catch (error) {
      console.error("Fetch preparation error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch available companies
  const fetchCompanies = async () => {
    try {
      const auth = getAuthHeaders();

      if (!auth) return;

      const response = await API.get("/companies", auth);
      setCompanies(response.data.companies || []);
    } catch (error) {
      console.error("Fetch companies error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }
    }
  };

  // Select or unselect target companies
  const handleCompanyChange = (companyId) => {
    setSelectedCompanies((previous) => {
      if (previous.includes(companyId)) {
        return previous.filter((id) => id !== companyId);
      }

      return [...previous, companyId];
    });
  };

  // Save the preparation plan
  const savePreparation = async () => {
    try {
      const auth = getAuthHeaders();

      if (!auth) return;

      setSaving(true);

      const response = await API.put(
        "/preparation",
        {
          targetCompanies: selectedCompanies,

          goals: goals
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),

          skills: skills
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),

          completedTopics: completedTopics
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),

          pendingTopics: pendingTopics
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),

          roadmap,

          readinessScore: Number(readinessScore),
        },
        auth
      );

      setPreparation(response.data.preparation);
      alert("Preparation plan saved successfully.");
    } catch (error) {
      console.error("Save preparation error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      alert(
        error.response?.data?.message ||
          "Failed to save preparation plan."
      );
    } finally {
      setSaving(false);
    }
  };

  // Add a new roadmap item
  const addRoadmapItem = () => {
    setRoadmap((previous) => [
      ...previous,
      {
        title: "New Preparation Topic",
        description: "",
        priority: "medium",
        completed: false,
      },
    ]);
  };

  // Update a roadmap item
  const updateRoadmapItem = (index, field, value) => {
    setRoadmap((previous) =>
      previous.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };

  // Remove a roadmap item
  const removeRoadmapItem = (index) => {
    setRoadmap((previous) =>
      previous.filter((_, itemIndex) => itemIndex !== index)
    );
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Loading screen
  if (loading) {
    return (
      <div className="dashboard-page">
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="logo-small">G</div>
            <div>
              <h2>GradEcho AI</h2>
              <span>Student Panel</span>
            </div>
          </div>
        </aside>

        <main className="dashboard-main">
          <div className="empty-state">Loading preparation plan...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-small">G</div>
          <div>
            <h2>GradEcho AI</h2>
            <span>Student Panel</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            type="button"
            className="nav-item"
            onClick={() => navigate("/dashboard")}
          >
            🏠 <span>Dashboard</span>
          </button>

          <button
            type="button"
            className="nav-item"
            onClick={() => navigate("/companies")}
          >
            🏢 <span>Companies</span>
          </button>

          <button
            type="button"
            className="nav-item"
            onClick={() => navigate("/experiences")}
          >
            📚 <span>Experiences</span>
          </button>

          <button
            type="button"
            className="nav-item"
            onClick={() => navigate("/ai-advisor")}
          >
            🤖 <span>AI Advisor</span>
          </button>

          <button
            type="button"
            className="nav-item"
            onClick={() => navigate("/share-experience")}
          >
            ✍️ <span>Share Experience</span>
          </button>


          <button
            type="button"
            className="nav-item active"
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
          type="button"
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
            <span className="page-label">STUDENT PREPARATION</span>
            <h1>My Preparation Plan</h1>
            <p>
              Organize your placement goals and track your preparation
              progress.
            </p>
          </div>
        </header>

        {/* READINESS SUMMARY */}
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-icon">🎯</span>
            <div>
              <h3>{readinessScore}%</h3>
              <p>Placement Readiness</p>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">🏢</span>
            <div>
              <h3>{selectedCompanies.length}</h3>
              <p>Target Companies</p>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">🗺️</span>
            <div>
              <h3>{roadmap.length}</h3>
              <p>Roadmap Topics</p>
            </div>
          </div>
        </div>

        {/* TARGET COMPANIES */}
        <section className="form-card">
          <div className="form-section-title">
            <div className="section-icon">🏢</div>
            <div>
              <h2>Target Companies</h2>
              <p>Select the companies you are preparing for.</p>
            </div>
          </div>

          <div className="preparation-company-grid">
            {companies.length === 0 ? (
              <p>No companies available.</p>
            ) : (
              companies.map((company) => (
                <label
                  className="preparation-company-option"
                  key={company._id}
                >
                  <input
                    type="checkbox"
                    checked={selectedCompanies.includes(company._id)}
                    onChange={() => handleCompanyChange(company._id)}
                  />
                  <span>{company.name}</span>
                </label>
              ))
            )}
          </div>
        </section>

        {/* GOALS AND SKILLS */}
        <section className="form-card">
          <div className="form-section-title">
            <div className="section-icon">🎯</div>
            <div>
              <h2>Goals & Skills</h2>
              <p>Enter multiple items separated by commas.</p>
            </div>
          </div>

          <div className="preparation-grid">
            <div className="form-group">
              <label>Preparation Goals</label>
              <textarea
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                placeholder="Example: Get placed, Improve coding, Crack TCS"
              />
            </div>

            <div className="form-group">
              <label>Skills</label>
              <textarea
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="Example: Java, Python, SQL, React"
              />
            </div>
          </div>
        </section>

        {/* TOPIC PROGRESS */}
        <section className="form-card">
          <div className="form-section-title">
            <div className="section-icon">📚</div>
            <div>
              <h2>Topic Progress</h2>
              <p>
                Track what you have completed and what still needs
                preparation.
              </p>
            </div>
          </div>

          <div className="preparation-grid">
            <div className="form-group">
              <label>Completed Topics</label>
              <textarea
                value={completedTopics}
                onChange={(e) => setCompletedTopics(e.target.value)}
                placeholder="Example: DBMS, OOP, HTML"
              />
            </div>

            <div className="form-group">
              <label>Pending Topics</label>
              <textarea
                value={pendingTopics}
                onChange={(e) => setPendingTopics(e.target.value)}
                placeholder="Example: DSA, System Design, CN"
              />
            </div>
          </div>
        </section>

        {/* READINESS SCORE */}
        <section className="form-card">
          <div className="form-section-title">
            <div className="section-icon">📊</div>
            <div>
              <h2>Readiness Score</h2>
              <p>
                Update your current self-assessed placement readiness.
              </p>
            </div>
          </div>

          <div className="readiness-control">
            <input
              type="range"
              min="0"
              max="100"
              value={readinessScore}
              onChange={(e) =>
                setReadinessScore(Number(e.target.value))
              }
            />

            <strong>{readinessScore}%</strong>
          </div>
        </section>

        {/* PREPARATION ROADMAP */}
        <section className="form-card">
          <div className="form-section-title">
            <div className="section-icon">🗺️</div>
            <div>
              <h2>Preparation Roadmap</h2>
              <p>Create and track your preparation steps.</p>
            </div>
          </div>

          <div className="preparation-roadmap">
            {roadmap.length === 0 ? (
              <div className="empty-state">
                <div style={{ fontSize: "40px" }}>🗺️</div>
                <h3>No Roadmap Items</h3>
                <p>Add your first preparation topic.</p>
              </div>
            ) : (
              roadmap.map((item, index) => (
                <div
                  className="roadmap-item"
                  key={item._id || index}
                >
                  <div className="roadmap-number">{index + 1}</div>

                  <div className="roadmap-content">
                    <input
                      type="text"
                      value={item.title || ""}
                      onChange={(e) =>
                        updateRoadmapItem(
                          index,
                          "title",
                          e.target.value
                        )
                      }
                      placeholder="Topic title"
                    />

                    <textarea
                      value={item.description || ""}
                      onChange={(e) =>
                        updateRoadmapItem(
                          index,
                          "description",
                          e.target.value
                        )
                      }
                      placeholder="Topic description"
                    />

                    <select
                      value={item.priority || "medium"}
                      onChange={(e) =>
                        updateRoadmapItem(
                          index,
                          "priority",
                          e.target.value
                        )
                      }
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>

                    <label className="roadmap-complete">
                      <input
                        type="checkbox"
                        checked={item.completed || false}
                        onChange={(e) =>
                          updateRoadmapItem(
                            index,
                            "completed",
                            e.target.checked
                          )
                        }
                      />
                      Completed
                    </label>
                  </div>

                  <button
                    type="button"
                    className="admin-reject-button"
                    onClick={() => removeRoadmapItem(index)}
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>

          <button
            type="button"
            className="admin-verify-button"
            onClick={addRoadmapItem}
          >
            + Add Roadmap Topic
          </button>
        </section>

        {/* SAVE PLAN */}
        <div className="preparation-save-container">
          <button
            type="button"
            className="admin-verify-button"
            onClick={savePreparation}
            disabled={saving}
          >
            {saving ? "Saving..." : "💾 Save Preparation Plan"}
          </button>
        </div>
      </main>
    </div>
  );
}

export default Preparation;