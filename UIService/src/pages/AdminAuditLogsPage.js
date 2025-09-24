import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";

/**
 * Admin-only audit logs viewer with search filter.
 */
export default function AdminAuditLogsPage() {
  const { api } = useAuth();
  const [logs, setLogs] = useState([]);
  const [q, setQ] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    api.getAuditLogs()
      .then((data) => mounted && setLogs(Array.isArray(data) ? data : []))
      .catch((err) => mounted && setError(err?.body?.error || err.message));
    return () => { mounted = false; };
  }, [api]);

  const filtered = useMemo(() => {
    const query = q.toLowerCase();
    if (!query) return logs;
    return logs.filter((l) =>
      (l.user || "").toLowerCase().includes(query) ||
      (l.action || "").toLowerCase().includes(query) ||
      (l.details || "").toLowerCase().includes(query)
    );
  }, [logs, q]);

  return (
    <main className="container" style={styles.container} aria-labelledby="auditTitle">
      <h1 id="auditTitle" style={styles.title}>Audit Logs</h1>
      {error && <div role="alert" style={styles.alertError}>Error: {error}</div>}
      <div style={styles.controls}>
        <label htmlFor="q" style={styles.label}>Search</label>
        <input
          id="q"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filter by user, action, or details"
          style={styles.input}
        />
      </div>
      <div role="region" aria-label="Audit logs table" style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Timestamp</th>
              <th style={styles.th}>User</th>
              <th style={styles.th}>Action</th>
              <th style={styles.th}>Details</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((l, idx) => (
              <tr key={idx}>
                <td style={styles.td}>{formatTime(l.timestamp)}</td>
                <td style={styles.td}>{l.user}</td>
                <td style={styles.td}>{l.action}</td>
                <td style={styles.td}>{l.details}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} style={styles.tdEmpty}>No logs found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}

function formatTime(iso) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso || "";
  }
}

const styles = {
  container: { maxWidth: 1000, margin: "1rem auto", padding: "1rem" },
  title: { color: "var(--text-primary)" },
  controls: { display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" },
  label: { color: "var(--text-primary)" },
  input: {
    padding: "0.5rem",
    borderRadius: 8,
    border: "1px solid var(--border-color)",
    background: "var(--bg-primary)",
    color: "var(--text-primary)",
    flex: 1
  },
  tableWrap: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", borderBottom: "1px solid var(--border-color)", padding: "0.5rem", color: "var(--text-primary)" },
  td: { borderBottom: "1px solid var(--border-color)", padding: "0.5rem", color: "var(--text-primary)" },
  tdEmpty: { padding: "1rem", textAlign: "center", color: "var(--text-primary)" },
  alertError: { background: "#c62828", color: "#fff", padding: "0.5rem", borderRadius: 6, marginBottom: "0.75rem" }
};
