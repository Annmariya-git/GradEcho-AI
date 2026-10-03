
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import API from "../services/api";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mentorshipLoading, setMentorshipLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await API.get("/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data.profile);
      } catch (error) {
        console.error("Failed to load profile:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleMentorshipToggle = async () => {
    try {
      setMentorshipLoading(true);

      const token = localStorage.getItem("token");

      const response = await API.put(
        "/profile/mentorship",
        {
          mentorshipAvailable: !user?.mentorshipAvailable,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser((prev) => ({
        ...prev,
        mentorshipAvailable:
          response.data.profile.mentorshipAvailable,
      }));
    } catch (error) {
      console.error(
        "Failed to update mentorship availability:",
        error
      );
      alert(
        error.response?.data?.message ||
          "Could not update mentorship availability."
      );
    } finally {
      setMentorshipLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <main className="dashboard-main">
          <div className="loading-state">
            Loading profile...
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

          <button className="nav-item active">
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
        <header className="dashboard-header">
          <div>
            <h1>My Profile</h1>
            <p>View and manage your GradEcho AI profile.</p>
          </div>

          <div className="user-info">
            <div className="user-avatar">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>

            <div>
              <strong>{user?.name || "Student"}</strong>
              <span>{user?.department || "Student"}</span>
            </div>
          </div>
        </header>

        {/* Profile Card */}
        <section className="profile-container">
          <div className="profile-card">
            <div className="profile-header">
              <div className="profile-avatar">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>

              <div>
                <h2>{user?.name || "Student"}</h2>
                <p>{user?.email || "No email available"}</p>

                <span className="profile-role">
                  {user?.role === "admin"
                    ? "Administrator"
                    : "Student"}
                </span>
              </div>
            </div>

            <div className="profile-details">
              <div className="profile-field">
                <span>Full Name</span>
                <strong>{user?.name || "Not provided"}</strong>
              </div>

              <div className="profile-field">
                <span>Email</span>
                <strong>{user?.email || "Not provided"}</strong>
              </div>

              <div className="profile-field">
                <span>Department</span>
                <strong>{user?.department || "Not provided"}</strong>
              </div>

              <div className="profile-field">
                <span>Batch</span>
                <strong>{user?.batch || "Not provided"}</strong>
              </div>

              <div className="profile-field">
                <span>College</span>
                <strong>{user?.college || "Not provided"}</strong>
              </div>

              <div className="profile-field">
                <span>Contributor Status</span>
                {user?.isVerifiedContributor ? (
                  <span className="contributor-badge verified">
                    ✓ Verified Contributor
                  </span>
                ) : (
                  <span className="contributor-badge">
                    Not Verified
                  </span>
                )}
              </div>

              <div className="profile-field">
                <span>Verified Experiences</span>
                <strong>
                  {user?.verifiedExperienceCount || 0}
                </strong>
              </div>

              <div className="profile-field">
                <span>Mentorship Availability</span>

                <div>
                  <span
                    className={
                      user?.mentorshipAvailable
                        ? "contributor-badge verified"
                        : "contributor-badge"
                    }
                  >
                    {user?.mentorshipAvailable
                      ? "✓ Available for Mentorship"
                      : "Not Available"}
                  </span>

                  <button
                    type="button"
                    className="primary-action"
                    onClick={handleMentorshipToggle}
                    disabled={mentorshipLoading}
                  >
                    {mentorshipLoading
                      ? "Updating..."
                      : user?.mentorshipAvailable
                      ? "Turn Off Mentorship"
                      : "Enable Mentorship"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Profile;