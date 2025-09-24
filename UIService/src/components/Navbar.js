import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// PUBLIC_INTERFACE
export default function Navbar({ theme, onToggleTheme }) {
  /** Accessible, responsive navigation bar */
  const { isAuthenticated, isAdmin, user, logout } = useAuth();

  return (
    <nav className="navbar" aria-label="Primary navigation" style={styles.nav}>
      <div style={styles.left}>
        <Link to="/" style={styles.brand} aria-label="UI Service Home">UI Service</Link>
        {isAuthenticated && (
          <>
            <NavLink to="/dashboard" style={styles.link}>Dashboard</NavLink>
            <NavLink to="/account" style={styles.link}>Account</NavLink>
            {isAdmin && <NavLink to="/admin/audit-logs" style={styles.link}>Audit Logs</NavLink>}
          </>
        )}
      </div>
      <div style={styles.right}>
        <button onClick={onToggleTheme} aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`} style={styles.btn}>
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
        {isAuthenticated ? (
          <>
            <span aria-live="polite" style={styles.user}>Signed in as {user || "User"}</span>
            <button onClick={logout} style={styles.btnSecondary} aria-label="Logout">Logout</button>
          </>
        ) : (
          <NavLink to="/login" style={styles.link}>Login</NavLink>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    padding: "0.75rem 1rem",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "1px solid var(--border-color)",
    background: "var(--bg-secondary)",
    position: "sticky",
    top: 0,
    zIndex: 10
  },
  left: { display: "flex", gap: "1rem", alignItems: "center" },
  right: { display: "flex", gap: "0.75rem", alignItems: "center" },
  brand: { fontWeight: 700, color: "var(--text-primary)", textDecoration: "none" },
  link: { color: "var(--text-primary)", textDecoration: "none" },
  btn: {
    background: "var(--button-bg)",
    color: "var(--button-text)",
    border: "none",
    borderRadius: 8,
    padding: "0.5rem 0.75rem",
    cursor: "pointer"
  },
  btnSecondary: {
    background: "transparent",
    color: "var(--text-primary)",
    border: "1px solid var(--border-color)",
    borderRadius: 8,
    padding: "0.5rem 0.75rem",
    cursor: "pointer"
  },
  user: { color: "var(--text-primary)", fontSize: 14 }
};
