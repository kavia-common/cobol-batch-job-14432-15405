"use strict";

/**
 * API client for communicating with the API Gateway based on the provided OpenAPI spec.
 * Handles auth header injection, JSON serialization, errors, and telemetry logging.
 */

const DEFAULT_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://api.example.com/api/v1";

// PUBLIC_INTERFACE
export function createApiClient(getToken, onUnauthorized) {
  /**
   * This is a public function.
   * Creates a configured API client bound to a token getter and unauthorized handler.
   */
  const baseUrl = DEFAULT_BASE_URL;

  async function request(path, options = {}) {
    const headers = new Headers(options.headers || {});
    headers.set("Content-Type", "application/json");

    const token = getToken ? getToken() : null;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const res = await fetch(`${baseUrl}${path}`, {
      ...options,
      headers
    });

    const contentType = res.headers.get("content-type") || "";
    let body = null;
    if (contentType.includes("application/json")) {
      try {
        body = await res.json();
      } catch (e) {
        body = null;
      }
    } else {
      body = await res.text().catch(() => null);
    }

    if (!res.ok) {
      if (res.status === 401 && typeof onUnauthorized === "function") {
        onUnauthorized();
      }
      const err = new Error(body?.error || `HTTP ${res.status}`);
      err.status = res.status;
      err.body = body;
      throw err;
    }

    return body;
  }

  return {
    // PUBLIC_INTERFACE
    async login(username, password) {
      /** Authenticates user and returns { token, expiresIn } */
      if (!username || !password) {
        const err = new Error("Username and password are required.");
        err.status = 400;
        throw err;
      }
      return request("/login", {
        method: "POST",
        body: JSON.stringify({ username, password })
      });
    },

    // PUBLIC_INTERFACE
    async logout() {
      /** Invalidates current session token. */
      return request("/logout", { method: "POST" });
    },

    // PUBLIC_INTERFACE
    async getSession() {
      /** Returns session details. */
      return request("/session", { method: "GET" });
    },

    // PUBLIC_INTERFACE
    async terminateSession() {
      /** Terminates session. */
      return request("/session", { method: "DELETE" });
    },

    // PUBLIC_INTERFACE
    async getBalance() {
      /** Returns { balance, currency } */
      return request("/account/balance", { method: "GET" });
    },

    // PUBLIC_INTERFACE
    async credit(amount) {
      /** Credits account with positive amount. */
      validateAmount(amount);
      return request("/account/credit", {
        method: "POST",
        body: JSON.stringify({ amount: Number(amount) })
      });
    },

    // PUBLIC_INTERFACE
    async debit(amount) {
      /** Debits account with positive amount. */
      validateAmount(amount);
      return request("/account/debit", {
        method: "POST",
        body: JSON.stringify({ amount: Number(amount) })
      });
    },

    // PUBLIC_INTERFACE
    async getAuditLogs() {
      /** Returns an array of audit logs (admin only). */
      return request("/admin/audit-logs", { method: "GET" });
    },

    // PUBLIC_INTERFACE
    async submitFeedback(message, type = "feedback") {
      /** Submits user feedback or error reports. */
      if (!message || typeof message !== "string" || message.trim().length < 3) {
        const err = new Error("Feedback message must be at least 3 characters.");
        err.status = 400;
        throw err;
      }
      if (!["error", "feedback"].includes(type)) {
        const err = new Error("Feedback type must be 'error' or 'feedback'.");
        err.status = 400;
        throw err;
      }
      return request("/feedback", {
        method: "POST",
        body: JSON.stringify({ message: message.trim(), type })
      });
    }
  };
}

function validateAmount(amount) {
  if (amount === null || amount === undefined || amount === "" || isNaN(Number(amount))) {
    const err = new Error("Amount must be a valid number.");
    err.status = 400;
    throw err;
  }
  const n = Number(amount);
  if (n <= 0) {
    const err = new Error("Amount must be greater than zero.");
    err.status = 400;
    throw err;
  }
}
