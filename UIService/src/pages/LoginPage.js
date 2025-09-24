import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Login page with accessible form, validation, and error feedback.
 */
export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const onChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.username || !form.password) {
      setError("Please enter both username and password.");
      return;
    }
    try {
      await login(form.username.trim(), form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err?.body?.error || err.message || "Login failed. Please try again.");
    }
  };

  return (
    <main className="container" style={styles.container} aria-labelledby="loginTitle">
      <h1 id="loginTitle" style={styles.title}>Sign in</h1>
      <form onSubmit={onSubmit} noValidate aria-describedby={error ? "loginError" : undefined} style={styles.form}>
        {error && (
          <div role="alert" id="loginError" style={styles.alert}>
            {error}
          </div>
        )}
        <label htmlFor="username" style={styles.label}>Username</label>
        <input
          id="username"
          name="username"
          type="text"
          value={form.username}
          onChange={onChange}
          autoComplete="username"
          required
          style={styles.input}
        />
        <label htmlFor="password" style={styles.label}>Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={form.password}
          onChange={onChange}
          autoComplete="current-password"
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button} aria-label="Sign in">Sign in</button>
      </form>
    </main>
  );
}

const styles = {
  container: { maxWidth: 420, margin: "2rem auto", padding: "1rem" },
  title: { marginBottom: "1rem", color: "var(--text-primary)" },
  form: { display: "grid", gap: "0.75rem" },
  label: { color: "var(--text-primary)" },
  input: {
    padding: "0.5rem",
    borderRadius: 8,
    border: "1px solid var(--border-color)",
    background: "var(--bg-primary)",
    color: "var(--text-primary)"
  },
  button: {
    marginTop: "0.5rem",
    background: "var(--button-bg)",
    color: "var(--button-text)",
    border: "none",
    padding: "0.65rem",
    borderRadius: 8,
    cursor: "pointer"
  },
  alert: {
    background: "#c62828",
    color: "#fff",
    padding: "0.5rem",
    borderRadius: 6
  }
};
