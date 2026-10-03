import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import API from "../services/api";

function Login() {

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post("/auth/login", {
        email,
        password,
      });

      console.log("Login successful:", response.data);

localStorage.setItem("token", response.data.token);

localStorage.setItem(
  "user",
  JSON.stringify(response.data.user)
);

alert("Login successful!");

if (response.data.user?.role === "admin") {
  navigate("/admin");
} else {
  navigate("/dashboard");
}

    } catch (error) {
      console.error("Login error:", error);

      alert(
        error.response?.data?.message ||
        "Login failed. Please try again."
      );
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="logo-circle">
          G
        </div>

        <h1>GradEcho AI</h1>

        <p className="subtitle">
          AI-Powered Placement Intelligence Network
        </p>

        <form onSubmit={handleLogin}>

          <div className="input-group">
            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="login-button"
          >
            Login
          </button>

        </form>

        <p className="register-text">
  Don't have an account?{" "}
  <span onClick={() => navigate("/register")}>Register</span>
</p>
      </div>
    </div>
  );
}

export default Login;