"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function HomePage() {
  const router = useRouter();
  const { token, loading, user } = useAuth();

  useEffect(() => {
    // No redirect here authenticated users can still see the landing page
    // but get the personalised nav
  }, []);

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column" }}>
      {/* Nav */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.5rem 2.5rem" }}>
        <span className="font-display" style={{ fontSize: "1.4rem", color: "var(--gold)", letterSpacing: "0.05em" }}>
          Resumé
        </span>

        {!loading && (
          token ? (
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <p style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>{user?.email}</p>
              <button
                onClick={() => router.push("/dashboard")}
                style={{ fontSize: "0.875rem", padding: "0.5rem 1.25rem", background: "transparent", color: "var(--text-muted)", border: "1px solid var(--border-light)", borderRadius: "8px", cursor: "pointer" }}
              >
                Dashboard
              </button>
              <button
                onClick={() => router.push("/analyze")}
                style={{ fontSize: "0.875rem", padding: "0.5rem 1.25rem", background: "var(--gold)", color: "#0a0808", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 500 }}
              >
                New analysis
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                onClick={() => router.push("/auth")}
                style={{ fontSize: "0.875rem", padding: "0.5rem 1.25rem", background: "transparent", color: "var(--text-muted)", border: "1px solid var(--border-light)", borderRadius: "8px", cursor: "pointer" }}
              >
                Sign in
              </button>
              <button
                onClick={() => router.push("/auth")}
                style={{ fontSize: "0.875rem", padding: "0.5rem 1.25rem", background: "var(--gold)", color: "#0a0808", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 500 }}
              >
                Get started
              </button>
            </div>
          )
        )}
      </nav>

      {/* Hero */}
      <section style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 1.5rem 6rem" }}>
        <p style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "2rem" }}>
          Powered by Claude AI
        </p>

        <h1 className="font-display" style={{ fontSize: "clamp(3.5rem, 8vw, 6.5rem)", lineHeight: 1.05, color: "var(--text)", fontWeight: 300, marginBottom: "1.5rem" }}>
          Your resume,<br />
          <em style={{ color: "var(--gold)", fontStyle: "italic" }}>perfected.</em>
        </h1>

        <p style={{ fontSize: "1.05rem", color: "var(--text-muted)", fontWeight: 300, maxWidth: "480px", lineHeight: 1.7, marginBottom: "2.5rem" }}>
          Upload your resume, paste a job description, and receive a precise match score with tailored feedback in seconds.
        </p>

        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
          <button
            onClick={() => router.push(token ? "/analyze" : "/auth")}
            style={{ fontSize: "0.9rem", padding: "0.875rem 2rem", background: "var(--gold)", color: "#0a0808", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: 500 }}
          >
            {token ? "New analysis" : "Analyze my resume"}
          </button>
          {!token && (
            <button
              onClick={() => router.push("/auth")}
              style={{ fontSize: "0.9rem", padding: "0.875rem 2rem", background: "transparent", color: "var(--text-muted)", border: "1px solid var(--border-light)", borderRadius: "10px", cursor: "pointer" }}
            >
              Sign in
            </button>
          )}
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: "4rem", marginTop: "5rem", paddingTop: "2rem", borderTop: "1px solid var(--border)" }}>
          {[{ value: "0/100", label: "Match score" }, { value: "Instant", label: "Results" }, { value: "Free", label: "To start" }].map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <p className="font-display" style={{ fontSize: "2rem", color: "var(--text)", fontWeight: 300 }}>{s.value}</p>
              <p style={{ fontSize: "0.75rem", color: "var(--text-dim)", marginTop: "0.25rem" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}