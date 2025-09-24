import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Dashboard page with balance preview and quick actions.
 */
export default function DashboardPage() {
  const { api, isAdmin } = useAuth();
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    api.getBalance()
      .then((b) => mounted && setBalance(b))
      .catch((err) => mounted && setError(err?.body?.error || err.message));
    return () => { mounted = false; };
  }, [api]);

  return (
    <main className="container" style={styles.container} aria-labelledby="dashboardTitle">
      <h1 id="dashboardTitle" style={styles.title}>Dashboard</h1>
      {error && <div role="alert" style={styles.alert}>Error: {error}</div>}
      {balance && (
        <section aria-label="Balance summary" style={styles.card}>
          <h2 style={styles.h2}>Current Balance</h2>
          <p style={styles.balance}>
            {new Intl.NumberFormat(undefined, { style: "currency", currency: balance.currency || "USD" }).format(balance.balance || 0)}
          </p>
        </section>
      )}
      <section aria-label="Quick actions" style={styles.grid}>
        <Link to="/account" style={styles.action}>Go to Account</Link>
        {isAdmin && <Link to="/admin/audit-logs" style={styles.action}>View Audit Logs</Link>}
        <Link to="/feedback" style={styles.action}>Send Feedback</Link>
      </section>
    </main>
  );
}

const styles = {
  container: { maxWidth: 900, margin: "1rem auto", padding: "1rem" },
  title: { color: "var(--text-primary)" },
  alert: { background: "#c62828", color: "#fff", padding: "0.5rem", borderRadius: 6, margin: "0.5rem 0" },
  card: {
    border: "1px solid var(--border-color)",
    borderRadius: 8,
    padding: "1rem",
    marginBottom: "1rem",
    background: "var(--bg-secondary)"
  },
  h2: { marginTop: 0, color: "var(--text-primary)" },
  balance: { fontSize: 28, fontWeight: 700 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.75rem" },
  action: {
    display: "block",
    textDecoration: "none",
    border: "1px solid var(--border-color)",
    padding: "0.75rem",
    borderRadius: 8,
    background: "var(--bg-secondary)",
    color: "var(--text-primary)",
    textAlign: "center"
  }
};
