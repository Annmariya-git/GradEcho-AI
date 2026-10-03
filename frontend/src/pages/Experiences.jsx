import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import API from "../services/api";

function Experiences() {
  const navigate = useNavigate();

  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await API.get("/experiences", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setExperiences(response.data.experiences || []);
      } catch (error) {
        console.error("Failed to load experiences:", error);

        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, [navigate]);

  const filteredExperiences = experiences.filter((experience) => {
    const companyName =
      experience.company?.name?.toLowerCase() || "";

    const role =
      experience.role?.toLowerCase() || "";

    const searchText = search.toLowerCase();

    return (
      companyName.includes(searchText) ||
      role.includes(searchText)
    );
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

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

          <button className="nav-item active">
            📚 <span>Experiences</span>
          </button>

          <button
  className="nav-item"
  onClick={() => navigate("/ai-advisor")}
>
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

      {/* Main Content */}
      <main className="dashboard-main">

        {/* Header */}
        <header className="page-top">

          <div>
            <span className="page-label">
              PLACEMENT KNOWLEDGE
            </span>

            <h1>Placement Experiences</h1>

            <p>
              Learn from verified placement experiences shared by students.
            </p>
          </div>

          <div className="company-count">
            <strong>{experiences.length}</strong>
            <span>Experiences</span>
          </div>

        </header>

        {/* Search */}
        <div className="search-container">

          <span className="search-icon">🔍</span>

          <input
            type="text"
            placeholder="Search by company or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

        {/* Loading */}
        {loading && (
          <div className="page-state">

            <div className="loading-spinner"></div>

            <p>Loading placement experiences...</p>

          </div>
        )}

        {/* Empty */}
        {!loading && filteredExperiences.length === 0 && (
          <div className="page-state empty-state">

            <div className="empty-icon">📚</div>

            <h2>No experiences found</h2>

            <p>
              Try searching with a different company or role.
            </p>

          </div>
        )}

        {/* Experience Cards */}
        {!loading && filteredExperiences.length > 0 && (

          <div className="experience-grid">

            {filteredExperiences.map((experience) => (

              <div
                className="experience-card"
                key={experience._id}
              >

                {/* Card Header */}
                <div className="experience-header">

                  <div className="company-logo">

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

                    <h2>
                      {experience.company?.name || "Company"}
                    </h2>

                    <span className="company-industry">
                      {experience.company?.industry ||
                        "Information Technology"}
                    </span>

                  </div>

                </div>

                {/* Experience Meta */}
                <div className="experience-meta">

                  {experience.role && (
                    <span>
                      💼 {experience.role}
                    </span>
                  )}

                  {experience.batch && (
                    <span>
                      🎓 Batch {experience.batch}
                    </span>
                  )}

                  {experience.placementType && (
                    <span>
                      📍{" "}
                      {experience.placementType === "on-campus"
                        ? "On Campus"
                        : "Off Campus"}
                    </span>
                  )}

                  {experience.difficulty && (
                    <span>
                      📊{" "}
                      {experience.difficulty
                        .charAt(0)
                        .toUpperCase() +
                        experience.difficulty.slice(1)}
                    </span>
                  )}

                </div>

                {/* Verified */}
                <div className="verified-badge">
                  ✓ Verified Experience
                </div>

                {/* Description */}
                <p className="experience-description">

                  {experience.overallExperience ||
                    "Placement experience shared by a student."}

                </p>

                {/* Contributor */}
                <div className="contributor-info">

                  <strong>Shared by:</strong>{" "}

                  {experience.contributor?.name ||
                    "Student"}

                  {experience.contributor?.batch && (
                    <span>
                      {" "}• Batch{" "}
                      {experience.contributor.batch}
                    </span>
                  )}

                </div>

                {/* Button */}
                <button
                  className="experience-button"
                  onClick={() =>
                    navigate(
                      `/experiences/${experience._id}`
                    )
                  }
                >
                  View Full Experience →
                </button>

              </div>

            ))}

          </div>

        )}

      </main>

    </div>
  );
}

export default Experiences;