import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

/**
 * Feedback page to submit user feedback/error reports.
 */
export default function FeedbackPage() {
  const { api } = useAuth();
  const [message, setMessage] = useState("");
  const [type, setType] = useState("feedback");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus(""); setError("");
    try {
      await api.submitFeedback(message, type);
      setStatus("Feedback submitted successfully.");
      setMessage("");
    } catch (err) {
      setError(err?.body?.error || err.message);
    }
  };

  return (
    <main className="container" style={styles.container} aria-labelledby="feedbackTitle">
      <h1 id="feedbackTitle" style={styles.title}>Feedback</h1>
      {error && <div role="alert" style={styles.alertError}>{error}</div>}
      {status && <div role="status" aria-live="polite" style={styles.alertOk}>{status}</div>}
      <form onSubmit={onSubmit} style={styles.form} noValidate>
        <label htmlFor="type" style={styles.label}>Type</label>
        <select id="type" value={type} onChange={(e) => setType(e.target.value)} style={styles.input}>
          <option value="feedback">Feedback</option>
          <option value="error">Error</option>
        </select>

        <label htmlFor="message" style={styles.label}>Message</label>
        <textarea
          id="message"
          value={message}
          rows={5}
          onChange={(e) => setMessage(e.target.value)}
          style={{ ...styles.input, resize: "vertical" }}
          placeholder="Describe your feedback or error..."
        />

        <button type="submit" style={styles.btn}>Submit</button>
      </form>
    </main>
  );
}

const styles = {
  container: { maxWidth: 700, margin: "1rem auto", padding: "1rem" },
  title: { color: "var(--text-primary)" },
  form: { display: "grid", gap: "0.75rem" },
  label: { color: "var(--text-primary)" },
  input: {
    padding: "0.5rem",
    borderRadius: 8,
    border: "1px solid var(--border-color)",
    background: "var(--bg-primary)",
    color: "var(--text-primary)"
  },
  btn: {
    background: "var(--button-bg)",
    color: "var(--button-text)",
    border: "none",
    padding: "0.6rem 0.8rem",
    borderRadius: 8,
    cursor: "pointer"
  },
  alertError: { background: "#c62828", color: "#fff", padding: "0.5rem", borderRadius: 6, marginBottom: "0.75rem" },
  alertOk: { background: "#2e7d32", color: "#fff", padding: "0.5rem", borderRadius: 6, marginBottom: "0.75rem" }
};
