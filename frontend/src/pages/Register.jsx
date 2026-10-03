import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../index.css";
import API from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    batch: "",
    college: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await API.post("/auth/register", formData);

      console.log("Registration successful:", response.data);

      alert("Registration successful! Please login.");

      navigate("/login");

    } catch (error) {
      console.error("Registration error:", error);

      alert(
        error.response?.data?.message ||
        "Registration failed. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <div className="logo-circle">
          G
        </div>

        <h1>Create Account</h1>

        <p className="subtitle">
          Join the GradEcho AI placement community
        </p>

        <form onSubmit={handleRegister}>

          <div className="input-group">
            <label>Full Name</label>

            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Email</label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>

            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
            />
          </div>

          <div className="input-group">
            <label>Department</label>

            <input
              type="text"
              name="department"
              placeholder="e.g. MCA"
              value={formData.department}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Batch</label>

            <input
              type="text"
              name="batch"
              placeholder="e.g. 2026"
              value={formData.batch}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>College</label>

            <input
              type="text"
              name="college"
              placeholder="Enter your college"
              value={formData.college}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

        </form>

        <p className="register-text">
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </p>

      </div>

    </div>
  );
}

export default Register;