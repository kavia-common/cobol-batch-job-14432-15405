import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { createApiClient } from "../services/apiClient";

/**
 * AuthContext provides session token, role(s), and API methods.
 */
const AuthContext = createContext(null);

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /** Provides authentication state and API client to the component tree. */
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [expiresAt, setExpiresAt] = useState(() => {
    const v = localStorage.getItem("expiresAt");
    return v ? Number(v) : 0;
  });
  const [roles, setRoles] = useState(() => getRolesFromToken(token));
  const [user, setUser] = useState(() => getUserFromToken(token));

  const onUnauthorized = useCallback(() => {
    logout();
  }, []);

  const api = useMemo(() => {
    return createApiClient(() => token, onUnauthorized);
  }, [token, onUnauthorized]);

  useEffect(() => {
    // Attempt silent session validation on mount
    if (token) {
      api.getSession().catch(() => {
        logout();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(async (username, password) => {
    const res = await api.login(username, password);
    if (!res?.token) throw new Error("Invalid login response");
    const now = Date.now();
    const exp = res.expiresIn ? now + res.expiresIn * 1000 : now + 3600 * 1000;
    localStorage.setItem("token", res.token);
    localStorage.setItem("expiresAt", String(exp));
    setToken(res.token);
    setExpiresAt(exp);
    setRoles(getRolesFromToken(res.token));
    setUser(getUserFromToken(res.token));
    return true;
  }, [api]);

  const logout = useCallback(() => {
    // Best-effort logout to server, but clear client either way
    api.logout().catch(() => undefined);
    localStorage.removeItem("token");
    localStorage.removeItem("expiresAt");
    setToken("");
    setExpiresAt(0);
    setRoles([]);
    setUser(null);
  }, [api]);

  const value = useMemo(() => ({
    token,
    roles,
    user,
    expiresAt,
    isAuthenticated: Boolean(token),
    isAdmin: roles.includes("admin"),
    api,
    login,
    logout
  }), [api, expiresAt, roles, token, user, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// PUBLIC_INTERFACE
export function useAuth() {
  /** Hook to access auth context. */
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

function getRolesFromToken(jwt) {
  try {
    if (!jwt) return [];
    const decoded = jwtDecode(jwt);
    // Common claim keys for roles: roles, scope, authorities
    if (Array.isArray(decoded.roles)) return decoded.roles;
    if (typeof decoded.scope === "string") return decoded.scope.split(" ");
    if (Array.isArray(decoded.authorities)) return decoded.authorities;
    return [];
  } catch {
    return [];
  }
}

function getUserFromToken(jwt) {
  try {
    if (!jwt) return null;
    const decoded = jwtDecode(jwt);
    return decoded.sub || decoded.user || decoded.username || null;
  } catch {
    return null;
  }
}
