import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import API from "../services/api";

function Contributors() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(null);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await API.get("/users/contributors", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(response.data.users || []);
    } catch (error) {
      console.error("Failed to load contributors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleConnect = async (userId) => {
    try {
      setConnecting(userId);

      const token = localStorage.getItem("token");

      await API.post(
        `/connections/request/${userId}`,
        {
          message: "I would like to connect with you on GradEcho AI.",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Connection request sent successfully.");

    } catch (error) {
      console.error("Connection request error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to send connection request."
      );
    } finally {
      setConnecting(null);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <main className="dashboard-main">
          <div className="loading-state">
            Loading contributors...
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
            className="nav-item"
            onClick={() => navigate("/preparation")}
          >
            🎯 <span>Preparation</span>
          </button>

          <button
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

          <button className="nav-item active">
            👥 <span>Contributors</span>
          </button>

        </nav>

        <button
          className="logout-button"
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login");
          }}
        >
          🚪 Logout
        </button>

      </aside>

      {/* Main Content */}
      <main className="dashboard-main">

        <header className="dashboard-header">
          <div>
            <h1>Contributors</h1>
            <p>
              Connect with students and verified placement contributors.
            </p>
          </div>
        </header>

        <section className="profile-container">

          {users.length === 0 ? (
            <div className="profile-card">
              <h2>No Contributors Found</h2>
              <p>
                There are currently no other users available.
              </p>
            </div>
          ) : (
            users.map((person) => (
              <div
                className="profile-card"
                key={person._id}
                style={{ marginBottom: "20px" }}
              >

                <div className="profile-header">

                  <div className="profile-avatar">
                    {person.name
                      ?.charAt(0)
                      .toUpperCase() || "U"}
                  </div>

                  <div>
                    <h2>{person.name}</h2>

                    <p>
                      {person.department || "Student"}
                    </p>

                    {person.isVerifiedContributor && (
                      <span className="contributor-badge verified">
                        ✓ Verified Contributor
                      </span>
                    )}
                  </div>

                </div>

                <div className="profile-details">

                  <div className="profile-field">
                    <span>College</span>
                    <strong>
                      {person.college || "Not provided"}
                    </strong>
                  </div>

                  <div className="profile-field">
                    <span>Batch</span>
                    <strong>
                      {person.batch || "Not provided"}
                    </strong>
                  </div>

                  <div className="profile-field">
                    <span>Mentorship</span>
                    <strong>
                      {person.mentorshipAvailable
                        ? "Available"
                        : "Not Available"}
                    </strong>
                  </div>

                </div>

                <div style={{ marginTop: "20px" }}>

                  <button
                    className="primary-action"
                    onClick={() =>
                      handleConnect(person._id)
                    }
                    disabled={connecting === person._id}
                  >
                    {connecting === person._id
                      ? "Sending..."
                      : "🤝 Connect"}
                  </button>

                </div>

              </div>
            ))
          )}

        </section>

      </main>
    </div>
  );
}

export default Contributors;