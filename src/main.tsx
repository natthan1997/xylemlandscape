
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App";
import "./styles/index.css";

type RootErrorBoundaryState = { error: unknown };

class RootErrorBoundary extends React.Component<React.PropsWithChildren, RootErrorBoundaryState> {
  state: RootErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: unknown): RootErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: unknown) {
    // Keep a console trail for debugging.
    console.error("React render error:", error);
  }

  render() {
    if (this.state.error) {
      const message =
        this.state.error instanceof Error
          ? this.state.error.stack || this.state.error.message
          : typeof this.state.error === "string"
            ? this.state.error
            : "Unknown error";

      return (
        <div style={{ padding: 16, fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace" }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Application crashed</div>
          <div style={{ fontSize: 12, marginBottom: 12 }}>
            A component threw during render. Open DevTools Console for details.
          </div>
          <pre style={{ whiteSpace: "pre-wrap", fontSize: 12, lineHeight: 1.4, padding: 12, border: "1px solid rgba(0,0,0,0.12)", borderRadius: 12, background: "#f9fafb" }}>
            {message}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById("root")!).render(
  <RootErrorBoundary>
    <App />
  </RootErrorBoundary>
);
  