import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import AccountPage from "./pages/AccountPage";
import AdminAuditLogsPage from "./pages/AdminAuditLogsPage";
import FeedbackPage from "./pages/FeedbackPage";
import { ErrorBoundaryWithApi } from "./components/ErrorBoundary";

// PUBLIC_INTERFACE
function App() {
  /** Root application component with routing and theme switching. */
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  return (
    <div className="App">
      <AuthProvider>
        <ErrorBoundaryWithApi>
          <BrowserRouter>
            <Navbar theme={theme} onToggleTheme={toggleTheme} />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/account" element={<AccountPage />} />
                <Route path="/feedback" element={<FeedbackPage />} />
              </Route>
              <Route element={<AdminRoute />}>
                <Route path="/admin/audit-logs" element={<AdminAuditLogsPage />} />
              </Route>
              <Route path="*" element={<HomePage />} />
            </Routes>
          </BrowserRouter>
        </ErrorBoundaryWithApi>
      </AuthProvider>
    </div>
  );
}

export default App;
