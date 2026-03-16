"use client";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="landing-root">
      <div className="hero">
        <div className="hero-content">
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚠️</div>
          <h1 style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)", color: "#fff" }}>
            Something went wrong
          </h1>
          <p className="subtitle" style={{ maxWidth: "400px", margin: "0.5rem auto 2rem" }}>
            {error.message || "An unexpected error occurred."}
          </p>
          <button
            onClick={reset}
            className="cta"
            style={{ border: "none", cursor: "pointer", fontFamily: "inherit" }}
          >
            TRY AGAIN
          </button>
        </div>
      </div>
    </div>
  );
}
