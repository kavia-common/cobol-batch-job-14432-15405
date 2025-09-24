/**
 * Utilities to help with testing authenticated routes.
 */

// PUBLIC_INTERFACE
export function setTestToken(token = "dummy.jwt.token") {
  /** Sets a dummy JWT in localStorage for tests. */
  localStorage.setItem("token", token);
  localStorage.setItem("expiresAt", String(Date.now() + 3600 * 1000));
}

// PUBLIC_INTERFACE
export function clearTestToken() {
  /** Clears dummy JWT from localStorage. */
  localStorage.removeItem("token");
  localStorage.removeItem("expiresAt");
}
