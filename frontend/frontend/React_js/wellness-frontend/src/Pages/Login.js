import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/Api";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await loginUser(form);
      const token = res.data.token;
      if (!token) throw new Error("No token received");

      localStorage.setItem("hc_token", token);
      login({ token, user: null });
      navigate("/");
    } catch {
      setError("Login failed—please check your email and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100 position-relative"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1587502536263-3d4fdc48b1a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Green transparent overlay on top of image */}
      <div
        className="position-absolute w-100 h-100"
        style={{
          background:
            "linear-gradient(135deg, rgba(0,128,0,0.5), rgba(0,180,100,0.5))",
        }}
      ></div>

      <div
        className="card rounded-4 shadow-lg p-4 position-relative"
        style={{
          width: "400px",
          zIndex: 1,
          backgroundColor: "rgba(255,255,255,0.95)",
          border: "2px solid #28a745",
        }}
      >
        {/* Icon & Heading */}
        <div className="text-center mb-4">
          <img
            src="https://cdn-icons-png.flaticon.com/512/942/942748.png"
            alt="Login Icon"
            width="70"
            height="70"
            className="mb-3"
          />
          <h3 className="fw-bold text-success">Welcome Back</h3>
          <p className="text-muted">Login to your account</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label fw-semibold">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-control rounded-3 border-success"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label fw-semibold">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="form-control rounded-3 border-success"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn w-100 rounded-3 fw-semibold text-white"
            style={{
              backgroundColor: "#28a745",
              borderColor: "#28a745",
            }}
            disabled={loading}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="text-center mt-3">
          <small className="text-muted">
            Don’t have an account?{" "}
            <a href="/register" className="text-success fw-semibold">
              Register
            </a>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Login;
