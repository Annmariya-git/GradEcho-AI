import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import API from "../services/api";

function Connections() {
  const navigate = useNavigate();

  const [connections, setConnections] = useState([]);
const [currentUser, setCurrentUser] = useState(null);
const [loading, setLoading] = useState(true);

  const fetchConnections = async () => {
    try {
      const token = localStorage.getItem("token");
      const userResponse = await API.get("/auth/me", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

setCurrentUser(userResponse.data.user);

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await API.get("/connections", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setConnections(response.data.connections || []);
    } catch (error) {
      console.error("Failed to load connections:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  const handleAccept = async (connectionId) => {
    try {
      const token = localStorage.getItem("token");

      await API.put(
        `/connections/accept/${connectionId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchConnections();
    } catch (error) {
      console.error("Failed to accept connection:", error);
      alert(
        error.response?.data?.message ||
          "Failed to accept connection."
      );
    }
  };

  const handleReject = async (connectionId) => {
    try {
      const token = localStorage.getItem("token");

      await API.put(
        `/connections/reject/${connectionId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchConnections();
    } catch (error) {
      console.error("Failed to reject connection:", error);
      alert(
        error.response?.data?.message ||
          "Failed to reject connection."
      );
    }
  };

  const getOtherUser = (connection) => {
  const currentUserId = currentUser?._id;

  if (connection.requester?._id === currentUserId) {
    return connection.recipient;
  }

  return connection.requester;
};

  if (loading) {
    return (
      <div className="dashboard-page">
        <main className="dashboard-main">
          <div className="loading-state">
            Loading connections...
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

          <button className="nav-item active">
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
            <h1>Connections</h1>
            <p>
              Connect with verified contributors and placement peers.
            </p>
          </div>
        </header>

        <section className="profile-container">

          {connections.length === 0 ? (
            <div className="profile-card">
              <h2>No Connections Yet</h2>
              <p>
                You currently have no connection requests or
                accepted connections.
              </p>
            </div>
          ) : (
            connections.map((connection) => {
              const otherUser = getOtherUser(connection);

              return (
                <div
                  className="profile-card"
                  key={connection._id}
                  style={{ marginBottom: "20px" }}
                >

                  <div className="profile-header">

                    <div className="profile-avatar">
                      {otherUser?.name
                        ?.charAt(0)
                        .toUpperCase() || "U"}
                    </div>

                    <div>
                      <h2>
                        {otherUser?.name || "Unknown User"}
                      </h2>

                      <p>
                        {otherUser?.email || "No email"}
                      </p>

                      {otherUser?.isVerifiedContributor && (
                        <span className="contributor-badge verified">
                          ✓ Verified Contributor
                        </span>
                      )}
                    </div>

                  </div>

                  <div className="profile-details">

                    <div className="profile-field">
                      <span>Status</span>
                      <strong>
                        {connection.status}
                      </strong>
                    </div>

                    {connection.message && (
                      <div className="profile-field">
                        <span>Message</span>
                        <strong>
                          {connection.message}
                        </strong>
                      </div>
                    )}

                  </div>

                  {connection.status === "pending" && (
                    <div style={{ marginTop: "20px" }}>

                      <button
                        className="primary-action"
                        onClick={() =>
                          handleAccept(connection._id)
                        }
                      >
                        ✓ Accept
                      </button>

                      <button
                        className="logout-button"
                        style={{ marginLeft: "10px" }}
                        onClick={() =>
                          handleReject(connection._id)
                        }
                      >
                        ✕ Reject
                      </button>

                    </div>
                  )}

                  {connection.status === "accepted" && (
                    <div style={{ marginTop: "20px" }}>
                      <button
                        className="primary-action"
                        onClick={() =>
                          navigate(
                            `/messages/${connection._id}`
                          )
                        }
                      >
                        💬 Message
                      </button>
                    </div>
                  )}

                </div>
              );
            })
          )}

        </section>

      </main>
    </div>
  );
}

export default Connections;