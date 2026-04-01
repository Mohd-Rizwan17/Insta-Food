import React from "react";
import "../../styles/auth-shared.css";
import api from "../../lib/api";
import { useNavigate } from "react-router-dom";

const UserLogin = () => {
  const navigate = useNavigate();
  const [submitError, setSubmitError] = React.useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await api.post("/api/auth/user/login", {
        email,
        password,
      });

      console.log(response.data);
      navigate("/"); // Redirect to home after login
    } catch (error) {
      console.error("User login error", error);
      if (error.response?.data?.message) {
        setSubmitError(error.response.data.message);
      } else if (error.message === "Network Error") {
        setSubmitError(
          "Network Error: check if backend server is running and API URL is accessible",
        );
      } else {
        setSubmitError(error.message || "Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div
        className="auth-card"
        role="region"
        aria-labelledby="user-login-title"
      >
        <header>
          <h1 id="user-login-title" className="auth-title">
            Welcome back
          </h1>
          <p className="auth-subtitle">
            Sign in to continue your food journey.
          </p>
        </header>
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="field-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>
          <div className="field-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>
          <button className="auth-submit" type="submit">
            Sign In
          </button>
          {submitError && (
            <p className="error-text" role="alert">
              {submitError}
            </p>
          )}
        </form>
        <div className="auth-alt-action">
          New here? <a href="/user/register">Create account</a>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
