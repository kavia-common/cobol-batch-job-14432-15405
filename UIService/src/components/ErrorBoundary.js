import React from "react";
import { useAuth } from "../context/AuthContext";

/**
 * ErrorBoundary captures render errors and reports via feedback as 'error'.
 */
export default class ErrorBoundary extends React.Component {
  static contextType = React.createContext(null);

  constructor(props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true, message: error?.message || "Unexpected error" });
    // Attempt to send telemetry via feedback endpoint if available
    try {
      if (this.props.api) {
        this.props.api.submitFeedback(`${error?.message}\n${info?.componentStack || ""}`, "error").catch(() => undefined);
      }
    } catch {
      // ignore
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div role="alert" style={styles.alert}>
          <h2 style={styles.h2}>Something went wrong.</h2>
          <p>{this.state.message}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export function ErrorBoundaryWithApi({ children }) {
  const { api } = useAuth();
  return <ErrorBoundary api={api}>{children}</ErrorBoundary>;
}

const styles = {
  alert: { background: "#c62828", color: "#fff", padding: "1rem", borderRadius: 8, margin: "1rem" },
  h2: { marginTop: 0 }
};
