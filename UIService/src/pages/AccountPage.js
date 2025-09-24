import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

/**
 * Account operations: balance inquiry, credit, debit
 */
export default function AccountPage() {
  const { api } = useAuth();
  const [balance, setBalance] = useState(null);
  const [creditAmount, setCreditAmount] = useState("");
  const [debitAmount, setDebitAmount] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const refreshBalance = () => {
    setError("");
    api.getBalance()
      .then((b) => {
        setBalance(b);
      })
      .catch((err) => setError(err?.body?.error || err.message));
  };

  useEffect(() => {
    refreshBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onCredit = async (e) => {
    e.preventDefault();
    setError(""); setMessage("");
    try {
      await api.credit(creditAmount);
      setMessage("Account credited successfully.");
      setCreditAmount("");
      refreshBalance();
    } catch (err) {
      setError(err?.body?.error || err.message);
    }
  };

  const onDebit = async (e) => {
    e.preventDefault();
    setError(""); setMessage("");
    try {
      await api.debit(debitAmount);
      setMessage("Account debited successfully.");
      setDebitAmount("");
      refreshBalance();
    } catch (err) {
      setError(err?.body?.error || err.message);
    }
  };

  const currency = balance?.currency || "USD";
  const formatAmount = (v) => new Intl.NumberFormat(undefined, { style: "currency", currency }).format(v || 0);

  return (
    <main className="container" style={styles.container} aria-labelledby="accountTitle">
      <h1 id="accountTitle" style={styles.title}>Account</h1>

      {error && <div role="alert" style={styles.alertError}>{error}</div>}
      {message && <div role="status" aria-live="polite" style={styles.alertOk}>{message}</div>}

      <section style={styles.card} aria-label="Balance section">
        <div style={styles.row}>
          <h2 style={styles.h2}>Current Balance</h2>
          <button onClick={refreshBalance} style={styles.btnSecondary} aria-label="Refresh balance">Refresh</button>
        </div>
        <p style={styles.balance}>{formatAmount(balance?.balance)}</p>
      </section>

      <div style={styles.grid}>
        <form onSubmit={onCredit} style={styles.card} aria-labelledby="creditTitle" noValidate>
          <h2 id="creditTitle" style={styles.h2}>Credit</h2>
          <label htmlFor="creditAmount" style={styles.label}>Amount</label>
          <input
            id="creditAmount"
            type="number"
            inputMode="decimal"
            min="0.01"
            step="0.01"
            required
            value={creditAmount}
            onChange={(e) => setCreditAmount(e.target.value)}
            style={styles.input}
          />
          <button type="submit" style={styles.btn}>Credit</button>
        </form>

        <form onSubmit={onDebit} style={styles.card} aria-labelledby="debitTitle" noValidate>
          <h2 id="debitTitle" style={styles.h2}>Debit</h2>
          <label htmlFor="debitAmount" style={styles.label}>Amount</label>
          <input
            id="debitAmount"
            type="number"
            inputMode="decimal"
            min="0.01"
            step="0.01"
            required
            value={debitAmount}
            onChange={(e) => setDebitAmount(e.target.value)}
            style={styles.input}
          />
          <button type="submit" style={styles.btn}>Debit</button>
        </form>
      </div>
    </main>
  );
}

const styles = {
  container: { maxWidth: 900, margin: "1rem auto", padding: "1rem" },
  title: { color: "var(--text-primary)" },
  card: {
    border: "1px solid var(--border-color)",
    borderRadius: 8,
    padding: "1rem",
    background: "var(--bg-secondary)"
  },
  row: { display: "flex", alignItems: "center", justifyContent: "space-between" },
  h2: { marginTop: 0, color: "var(--text-primary)" },
  balance: { fontSize: 28, fontWeight: 700 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem", marginTop: "1rem" },
  label: { color: "var(--text-primary)" },
  input: {
    padding: "0.5rem",
    borderRadius: 8,
    border: "1px solid var(--border-color)",
    background: "var(--bg-primary)",
    color: "var(--text-primary)",
    marginBottom: "0.5rem"
  },
  btn: {
    background: "var(--button-bg)",
    color: "var(--button-text)",
    border: "none",
    padding: "0.6rem 0.8rem",
    borderRadius: 8,
    cursor: "pointer"
  },
  btnSecondary: {
    background: "transparent",
    color: "var(--text-primary)",
    border: "1px solid var(--border-color)",
    borderRadius: 8,
    padding: "0.45rem 0.7rem",
    cursor: "pointer"
  },
  alertError: { background: "#c62828", color: "#fff", padding: "0.5rem", borderRadius: 6, marginBottom: "0.75rem" },
  alertOk: { background: "#2e7d32", color: "#fff", padding: "0.5rem", borderRadius: 6, marginBottom: "0.75rem" }
};
