import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import API from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [preparation, setPreparation] = useState(null);
  const [companyCount, setCompanyCount] = useState(0);
  const [experienceCount, setExperienceCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const authHeaders = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        // Fetch user
        const userResponse = await API.get(
          "/auth/me",
          authHeaders
        );

        setUser(userResponse.data.user);

        // Fetch preparation
        try {
          const preparationResponse = await API.get(
            "/preparation",
            authHeaders
          );

          setPreparation(
            preparationResponse.data.preparation
          );
        } catch (error) {
          console.error(
            "Failed to load preparation:",
            error
          );
        }

        // Fetch companies
        try {
          const companiesResponse = await API.get(
            "/companies",
            authHeaders
          );

          setCompanyCount(
            companiesResponse.data.companies?.length || 0
          );
        } catch (error) {
          console.error(
            "Failed to load companies:",
            error
          );
        }

        // Fetch verified experiences
        try {
          const experiencesResponse = await API.get(
            "/experiences",
            authHeaders
          );

          const experiences =
  experiencesResponse.data.experiences || [];

const verifiedExperiences = experiences.filter(
  (experience) => experience.status === "verified"
);

setExperienceCount(verifiedExperiences.length);

        } catch (error) {
          console.error(
            "Failed to load experiences:",
            error
          );
        }
      } catch (error) {
        console.error(
          "Failed to load dashboard:",
          error
        );

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div className="dashboard-page">

      {/* ================= SIDEBAR ================= */}

      <aside className="sidebar">

        <div className="sidebar-logo">
          <div className="logo-small">G</div>

          <div>
            <h2>GradEcho AI</h2>
            <span>Placement Intelligence</span>
          </div>
        </div>

        <nav className="sidebar-nav">

          {/* Dashboard */}
          <button
            type="button"
            className="nav-item active"
            onClick={() => navigate("/dashboard")}
          >
            🏠 <span>Dashboard</span>
          </button>

          {/* Companies */}
          <button
            type="button"
            className="nav-item"
            onClick={() => navigate("/companies")}
          >
            🏢 <span>Companies</span>
          </button>

          {/* Experiences */}
          <button
            type="button"
            className="nav-item"
            onClick={() => navigate("/experiences")}
          >
            📚 <span>Experiences</span>
          </button>

          {/* AI Advisor */}
          <button
            type="button"
            className="nav-item"
            onClick={() => navigate("/ai-advisor")}
          >
            🤖 <span>AI Advisor</span>
          </button>

          {/* Share Experience */}
          <button
            type="button"
            className="nav-item"
            onClick={() =>
              navigate("/share-experience")
            }
          >
            📝 <span>Share Experience</span>
          </button>

          {/* Preparation */}
          <button
            type="button"
            className="nav-item"
            onClick={() => navigate("/preparation")}
          >
            🎯 <span>Preparation</span>
          </button>

          {/* My Profile */}
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

        {/* Logout */}
        <button
          type="button"
          className="logout-button"
          onClick={handleLogout}
        >
          🚪 Logout
        </button>

      </aside>

      {/* ================= MAIN CONTENT ================= */}

      <main className="dashboard-main">

        {/* Header */}
        <header className="dashboard-header">

          <div>
            <h1>Dashboard</h1>
            <p>
              Your placement journey starts here.
            </p>
          </div>

          <div className="user-info">

            <div className="user-avatar">
              {user?.name
                ?.charAt(0)
                .toUpperCase() || "U"}
            </div>

            <div>
              <strong>
                {user?.name || "Student"}
              </strong>

              <span>
                {user?.department || "Student"}
              </span>
            </div>

          </div>

        </header>

        {/* ================= WELCOME ================= */}

        <section className="welcome-card">

          <div>

            <span className="welcome-label">
              WELCOME BACK 👋
            </span>

            <h2>
              Hello, {user?.name || "Student"}!
            </h2>

            <p>
              Explore placement experiences, prepare
              for interviews, and learn from students
              who have already been there.
            </p>

            <button
              type="button"
              className="primary-action"
              onClick={() =>
                navigate("/experiences")
              }
            >
              Explore Experiences →
            </button>

          </div>

          <div className="welcome-icon">
            🎓
          </div>

        </section>

        {/* ================= STATS ================= */}

        <section className="stats-grid">

          {/* Companies */}
          <div className="stat-card">

            <div className="stat-icon">
              🏢
            </div>

            <div>
              <span>Companies</span>
              <strong>{companyCount}</strong>
            </div>

          </div>

          {/* Experiences */}
          <div className="stat-card">

            <div className="stat-icon">
              📚
            </div>

            <div>
              <span>
                Verified Experiences
              </span>

              <strong>
                {experienceCount}
              </strong>
            </div>

          </div>

          {/* Preparation */}
          <div className="stat-card">

            <div className="stat-icon">
              🎯
            </div>

            <div>
              <span>Preparation</span>

              <strong>
                {preparation?.readinessScore || 0}%
              </strong>
            </div>

          </div>

          {/* AI */}
          <div className="stat-card">

            <div className="stat-icon">
              🤖
            </div>

            <div>
              <span>AI Advisor</span>
              <strong>Ready</strong>
            </div>

          </div>

        </section>

        {/* ================= FEATURE SECTION ================= */}

        <section className="feature-section">

          <div className="section-heading">

            <h2>
              Explore GradEcho AI
            </h2>

            <p>
              Everything you need for your
              placement preparation.
            </p>

          </div>

          <div className="feature-grid">

            {/* Companies */}
            <div className="feature-card">

              <div className="feature-icon">
                🏢
              </div>

              <h3>
                Companies
              </h3>

              <p>
                Explore companies and understand
                their placement process.
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate("/companies")
                }
              >
                View Companies →
              </button>

            </div>

            {/* Experiences */}
            <div className="feature-card">

              <div className="feature-icon">
                📖
              </div>

              <h3>
                Placement Experiences
              </h3>

              <p>
                Read verified experiences shared
                by previous students.
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate("/experiences")
                }
              >
                Explore Experiences →
              </button>

            </div>

            {/* AI Advisor */}
            <div className="feature-card">

              <div className="feature-icon">
                🤖
              </div>

              <h3>
                AI Placement Advisor
              </h3>

              <p>
                Get personalized preparation
                guidance using Gemini AI.
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate("/ai-advisor")
                }
              >
                Ask AI →
              </button>

            </div>

            {/* Share Experience */}
            <div className="feature-card">

              <div className="feature-icon">
                📝
              </div>

              <h3>
                Share Your Experience
              </h3>

              <p>
                Help future students by sharing
                your placement journey.
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate("/share-experience")
                }
              >
                Share Experience →
              </button>

            </div>

            {/* Preparation */}
            <div className="feature-card">

              <div className="feature-icon">
                🎯
              </div>

              <h3>
                Student Preparation
              </h3>

              <p>
                Track your placement readiness,
                target companies, skills, topics,
                and preparation roadmap.
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate("/preparation")
                }
              >
                Continue Preparation →
              </button>

            </div>

            {/* Profile */}
            <div className="feature-card">

              <div className="feature-icon">
                👤
              </div>

              <h3>
                My Profile
              </h3>

              <p>
                View your personal information and
                contributor verification status.
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate("/profile")
                }
              >
                View Profile →
              </button>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;