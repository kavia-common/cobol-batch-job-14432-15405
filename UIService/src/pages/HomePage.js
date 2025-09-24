import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Home page for the UI Service.
 */
export default function HomePage() {
  const { isAuthenticated } = useAuth();
  return (
    <main className="container" style={styles.container} aria-labelledby="homeTitle">
      <h1 id="homeTitle" style={styles.title}>Modernized Accounting UI</h1>
      <p style={styles.p}>Welcome to the UI Service. Use this portal to manage your account.</p>
      {isAuthenticated ? (
        <Link to="/dashboard" style={styles.btn}>Go to Dashboard</Link>
      ) : (
        <Link to="/login" style={styles.btn}>Sign In</Link>
      )}
    </main>
  );
}

const styles = {
  container: { maxWidth: 900, margin: "1rem auto", padding: "1rem", textAlign: "center" },
  title: { color: "var(--text-primary)" },
  p: { color: "var(--text-primary)" },
  btn: {
    display: "inline-block",
    background: "var(--button-bg)",
    color: "var(--button-text)",
    border: "none",
    padding: "0.65rem 1rem",
    borderRadius: 8,
    cursor: "pointer",
    textDecoration: "none",
    marginTop: "1rem"
  }
};
