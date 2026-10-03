import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import API from "../services/api";

function ManageUsers() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await API.get("/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(response.data.users || []);

    } catch (error) {
      console.error("Fetch users error:", error);

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
    fetchUsers();
  }, []);


  const toggleContributorStatus = async (userId, currentStatus) => {
  try {
    const token = localStorage.getItem("token");

    const response = await API.put(
      `/users/${userId}/contributor-status`,
      {
        isVerifiedContributor: !currentStatus,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert(response.data.message);

    setUsers((previousUsers) =>
      previousUsers.map((user) =>
        user._id === userId
          ? {
              ...user,
              isVerifiedContributor:
                !currentStatus,
            }
          : user
      )
    );

  } catch (error) {
    console.error(
      "Contributor status error:",
      error
    );

    alert(
      error.response?.data?.message ||
        "Failed to update contributor status."
    );
  }
};

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
            className="nav-item"
            onClick={() => navigate("/experiences")}
          >
            📚 <span>Experiences</span>
          </button>

          <button
            className="nav-item active"
          >
            👥 <span>Manage Users</span>
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

            <h1>Manage Users</h1>

            <p>
              View and manage registered GradEcho AI users.
            </p>

          </div>

        </header>

        {/* USER COUNT */}
        <div className="stats-grid">

          <div className="stat-card">

            <span className="stat-icon">
              👥
            </span>

            <div>
              <h3>{users.length}</h3>
              <p>Total Users</p>
            </div>

          </div>

          <div className="stat-card">

            <span className="stat-icon">
              🎓
            </span>

            <div>
              <h3>
                {
                  users.filter(
                    (user) => user.role === "student"
                  ).length
                }
              </h3>

              <p>Students</p>
            </div>

          </div>

          <div className="stat-card">

            <span className="stat-icon">
              🛡️
            </span>

            <div>
              <h3>
                {
                  users.filter(
                    (user) => user.role === "admin"
                  ).length
                }
              </h3>

              <p>Admins</p>
            </div>

          </div>

        </div>

        {/* USERS SECTION */}
        <section className="form-card">

          <div className="form-section-title">

            <div className="section-icon">
              👥
            </div>

            <div>
              <h2>Registered Users</h2>

              <p>
                Users registered on the GradEcho AI platform.
              </p>
            </div>

          </div>

          {loading ? (

            <div className="empty-state">
              Loading users...
            </div>

          ) : users.length === 0 ? (

            <div className="empty-state">

              <div style={{ fontSize: "40px" }}>
                👥
              </div>

              <h3>No Users Found</h3>

              <p>
                No users have registered yet.
              </p>

            </div>

          ) : (

            <div className="admin-users-list">

              {users.map((user) => (

                <div
                  className="admin-user-card"
                  key={user._id}
                >

                  {/* USER HEADER */}
                  <div className="admin-user-header">

                    <div className="admin-user-avatar">

                      {user.name
                        ? user.name
                            .charAt(0)
                            .toUpperCase()
                        : "U"}

                    </div>

                    <div>

                      <h3>
                        {user.name}
                      </h3>

                      <p>
                        {user.email}
                      </p>

                    </div>

                  </div>

                  {/* USER INFORMATION */}
                  <div className="admin-user-info">

                    <span>
                      🎓 Role:{" "}
                      <strong>
                        {user.role}
                      </strong>
                    </span>

                    <span>
                      📚 Department:{" "}
                      {user.department || "Not specified"}
                    </span>

                    <span>
                      📅 Batch:{" "}
                      {user.batch || "Not specified"}
                    </span>

                    <span>
                      🏫 College:{" "}
                      {user.college || "Not specified"}
                    </span>

                  </div>

                  <div className="admin-user-status">

  {user.isVerifiedContributor ? (

    <>
      <span className="user-status verified">
        ✓ Verified Contributor
      </span>

      <button
        className="admin-reject-button"
        onClick={() =>
          toggleContributorStatus(
            user._id,
            true
          )
        }
      >
        Remove Verification
      </button>
    </>

  ) : (

    <>
      <span className="user-status normal">
        Student
      </span>

      <button
        className="admin-verify-button"
        onClick={() =>
          toggleContributorStatus(
            user._id,
            false
          )
        }
      >
        ✓ Verify Contributor
      </button>
    </>

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

export default ManageUsers;