import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import API from "../services/api";

function Companies() {
  const navigate = useNavigate();

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await API.get("/companies", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCompanies(response.data.companies || []);
      } catch (error) {
        console.error("Failed to load companies:", error);

        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [navigate]);

  const filteredCompanies = companies.filter((company) =>
    company.name?.toLowerCase().includes(search.toLowerCase())
  );

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

          <button className="nav-item active">
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

        {/* Page Header */}
        <header className="page-top">

          <div>
            <span className="page-label">
              PLACEMENT DIRECTORY
            </span>

            <h1>Companies</h1>

            <p>
              Explore companies and learn from verified placement experiences.
            </p>
          </div>

          <div className="company-count">
            <strong>{companies.length}</strong>
            <span>Companies</span>
          </div>

        </header>

        {/* Search */}
        <div className="search-container">

          <span className="search-icon">🔍</span>

          <input
            type="text"
            placeholder="Search companies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

        {/* Loading */}
        {loading && (
          <div className="page-state">
            <div className="loading-spinner"></div>
            <p>Loading companies...</p>
          </div>
        )}

        {/* Empty */}
        {!loading && filteredCompanies.length === 0 && (
          <div className="page-state empty-state">

            <div className="empty-icon">🏢</div>

            <h2>No companies found</h2>

            <p>
              Try searching with a different company name.
            </p>

          </div>
        )}

        {/* Companies */}
        {!loading && filteredCompanies.length > 0 && (

          <div className="modern-company-grid">

            {filteredCompanies.map((company) => (

              <div
                className="modern-company-card"
                key={company._id}
              >

                <div className="company-card-top">

                  <div className="modern-company-logo">

                    {company.logo ? (
                      <img
                        src={company.logo}
                        alt={company.name}
                      />
                    ) : (
                      company.name
                        ?.charAt(0)
                        .toUpperCase()
                    )}

                  </div>

                  <span className="active-status">
                    ● Active
                  </span>

                </div>

                <h2>{company.name}</h2>

                <span className="industry-tag">
                  {company.industry || "Technology"}
                </span>

                <p>
                  {company.description ||
                    "Explore placement opportunities, interview rounds and student experiences."}
                </p>

                <div className="company-card-footer">

                  <span>
                    📚 Placement Experiences
                  </span>

                  <button
                    onClick={() =>
                      navigate("/experiences")
                    }
                  >
                    Explore →
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </main>

    </div>
  );
}

export default Companies;