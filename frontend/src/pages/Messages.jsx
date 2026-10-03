import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../index.css";
import API from "../services/api";

function Messages() {
  const navigate = useNavigate();
  const { connectionId } = useParams();

  const [messages, setMessages] = useState([]);
const [newMessage, setNewMessage] = useState("");
const [currentUser, setCurrentUser] = useState(null);
const [loading, setLoading] = useState(true);
const [sending, setSending] = useState(false);

const token = localStorage.getItem("token");

  const fetchMessages = async () => {
    try {
      const response = await API.get(
        `/messages/${connectionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessages(response.data.messages || []);
    } catch (error) {
      console.error("Failed to load messages:", error);

      if (error.response?.status === 403) {
        alert(
          error.response?.data?.message ||
            "Messaging is available only for accepted connections."
        );
        navigate("/connections");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  const loadCurrentUser = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await API.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCurrentUser(response.data.user);

      await fetchMessages();
    } catch (error) {
      console.error("Failed to load current user:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }
    }
  };

  loadCurrentUser();
}, [connectionId]);

  const handleSendMessage = async (event) => {
    event.preventDefault();

    if (!newMessage.trim()) {
      return;
    }

    try {
      setSending(true);

      const response = await API.post(
        `/messages/${connectionId}`,
        {
          message: newMessage.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessages((prev) => [
        ...prev,
        response.data.data,
      ]);

      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);

      alert(
        error.response?.data?.message ||
          "Failed to send message."
      );
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <main className="dashboard-main">
          <div className="loading-state">
            Loading messages...
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
            <h1>Messages</h1>
            <p>
              Chat with your accepted GradEcho AI connection.
            </p>
          </div>
        </header>

        <section className="profile-container">

          <div className="profile-card">

            <h2>💬 Conversation</h2>

            <div
              style={{
                marginTop: "20px",
                minHeight: "300px",
                maxHeight: "400px",
                overflowY: "auto",
                padding: "15px",
                border: "1px solid #ddd",
                borderRadius: "10px",
              }}
            >

              {messages.length === 0 ? (
                <p>
                  No messages yet. Start the conversation!
                </p>
              ) : (
                messages.map((msg) => {
                  const isMine =
                    msg.sender?._id === currentUser?._id ||
                    msg.sender === currentUser?._id;

                  return (
                    <div
                      key={msg._id}
                      style={{
                        textAlign: isMine
                          ? "right"
                          : "left",
                        marginBottom: "15px",
                      }}
                    >
                      <div
                        style={{
                          display: "inline-block",
                          padding: "10px 15px",
                          borderRadius: "12px",
                          maxWidth: "70%",
                          background: isMine
                            ? "#e8f5e9"
                            : "#f1f1f1",
                        }}
                      >
                        <strong>
                          {msg.sender?.name ||
                            (isMine
                              ? "You"
                              : "User")}
                        </strong>

                        <p style={{ margin: "5px 0 0" }}>
                          {msg.message}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}

            </div>

            <form
              onSubmit={handleSendMessage}
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "20px",
              }}
            >

              <input
                type="text"
                value={newMessage}
                onChange={(event) =>
                  setNewMessage(event.target.value)
                }
                placeholder="Type your message..."
                disabled={sending}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                }}
              />

              <button
                type="submit"
                className="primary-action"
                disabled={sending}
              >
                {sending ? "Sending..." : "Send"}
              </button>

            </form>

          </div>

        </section>

      </main>
    </div>
  );
}

export default Messages;