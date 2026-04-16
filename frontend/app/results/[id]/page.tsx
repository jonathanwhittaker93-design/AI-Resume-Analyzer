"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getAnalysis } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface Analysis {
  id: string;
  resume_filename: string;
  match_score: number;
  missing_keywords: string[];
  strengths: string[];
  suggestions: string[];
  summary: string;
  created_at: string;
}

export default function ResultsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnalysis(id as string)
      .then((res) => setAnalysis(res.data))
      .catch(() => router.push("/dashboard"))
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Loading results...</p>
    </main>
  );

  if (!analysis) return null;

  const scoreColor =
    analysis.match_score >= 70 ? "#4caf88" :
    analysis.match_score >= 40 ? "#d4a853" : "#e07070";
  const scoreLabel =
    analysis.match_score >= 70 ? "Strong Match" :
    analysis.match_score >= 40 ? "Partial Match" : "Weak Match";

  const section = (label: string, hint: string, children: React.ReactNode) => (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", marginBottom: "1rem", overflow: "hidden" }}>
      <div style={{ padding: "1.25rem 1.75rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <p style={{ fontSize: "0.65rem", color: "var(--gold)", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 500 }}>{label}</p>
        <p style={{ fontSize: "0.7rem", color: "var(--text-dim)" }}>{hint}</p>
      </div>
      {children}
    </div>
  );

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", padding: "2.5rem 1.5rem" }}>
      <div style={{ maxWidth: "680px", margin: "0 auto" }}>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "3rem" }}>
          <div>
            <span className="font-display" style={{ fontSize: "1.4rem", color: "var(--gold)" }}>Resumé</span>
            <p style={{ fontSize: "0.75rem", color: "var(--text-dim)", marginTop: "0.25rem" }}>{user?.email}</p>
          </div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              onClick={() => router.push("/analyze")}
              style={{ fontSize: "0.875rem", padding: "0.6rem 1.25rem", background: "var(--gold)", color: "#0a0808", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 500, fontFamily: "DM Sans, sans-serif" }}
              onMouseEnter={e => (e.currentTarget.style.background = "var(--gold-light)")}
              onMouseLeave={e => (e.currentTarget.style.background = "var(--gold)")}
            >
              New analysis
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              style={{ fontSize: "0.875rem", padding: "0.6rem 1.25rem", background: "transparent", color: "var(--text-dim)", border: "1px solid var(--border)", borderRadius: "8px", cursor: "pointer", fontFamily: "DM Sans, sans-serif" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--text-muted)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text-dim)")}
            >
              Dashboard
            </button>
          </div>
        </div>

        <h1 className="font-display" style={{ fontSize: "2.75rem", fontWeight: 300, color: "var(--text)", marginBottom: "0.35rem" }}>
          Analysis Results
        </h1>
        <p style={{ fontSize: "0.75rem", color: "var(--text-dim)", marginBottom: "2.5rem" }}>
          {analysis.resume_filename} analyzed on {new Date(analysis.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
        </p>

        {section("Match Score", scoreLabel, (
          <div style={{ padding: "1.75rem" }}>
            <div style={{ display: "flex", alignItems: "flex-end", gap: "1.25rem", marginBottom: "1.5rem" }}>
              <span className="font-display" style={{ fontSize: "5rem", lineHeight: 1, fontWeight: 300, color: scoreColor }}>
                {analysis.match_score}
              </span>
              <div style={{ paddingBottom: "0.5rem" }}>
                <p style={{ fontSize: "0.65rem", color: "var(--text-dim)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.35rem" }}>out of 100</p>
                <div style={{ display: "flex", gap: "3px" }}>
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} style={{ width: "20px", height: "3px", borderRadius: "2px", background: i < Math.round(analysis.match_score / 10) ? scoreColor : "var(--border-light)" }} />
                  ))}
                </div>
              </div>
            </div>
            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.75, fontWeight: 300 }}>{analysis.summary}</p>
          </div>
        ))}

        {section("Strengths", `${analysis.strengths.length} identified`, (
          <div>
            {analysis.strengths.map((s, i) => (
              <div key={i} style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start", padding: "1.1rem 1.75rem", borderBottom: i < analysis.strengths.length - 1 ? "1px solid var(--border)" : "none" }}>
                <span className="font-display" style={{ fontSize: "1.25rem", color: "var(--gold)", opacity: 0.35, flexShrink: 0, lineHeight: 1, minWidth: "1.25rem", textAlign: "right", paddingTop: "2px" }}>{i + 1}</span>
                <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", fontWeight: 300, lineHeight: 1.7 }}>{s}</p>
              </div>
            ))}
          </div>
        ))}

        {section("Missing Keywords", "Add these to your resume", (
          <div style={{ padding: "1.5rem 1.75rem", display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {analysis.missing_keywords.map((kw, i) => (
              <span key={i} style={{ fontSize: "0.825rem", padding: "0.45rem 1rem", background: "rgba(200,169,110,0.07)", color: "var(--gold)", borderRadius: "8px", border: "1px solid rgba(200,169,110,0.18)", fontWeight: 300 }}>
                {kw}
              </span>
            ))}
          </div>
        ))}

        {section("Suggestions", "How to improve", (
          <div>
            {analysis.suggestions.map((s, i) => (
              <div key={i} style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start", padding: "1.1rem 1.75rem", borderBottom: i < analysis.suggestions.length - 1 ? "1px solid var(--border)" : "none" }}>
                <span className="font-display" style={{ fontSize: "1.25rem", color: "var(--gold)", opacity: 0.35, flexShrink: 0, lineHeight: 1, minWidth: "1.25rem", textAlign: "right", paddingTop: "2px" }}>{i + 1}</span>
                <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", fontWeight: 300, lineHeight: 1.7 }}>{s}</p>
              </div>
            ))}
          </div>
        ))}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginTop: "0.5rem" }}>
          <button
            onClick={() => router.push("/analyze")}
            style={{ padding: "1rem", background: "var(--gold)", color: "#0a0808", border: "none", borderRadius: "12px", fontSize: "0.875rem", fontWeight: 500, cursor: "pointer", fontFamily: "DM Sans, sans-serif" }}
            onMouseEnter={e => (e.currentTarget.style.background = "var(--gold-light)")}
            onMouseLeave={e => (e.currentTarget.style.background = "var(--gold)")}
          >
            Analyze another
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            style={{ padding: "1rem", background: "transparent", color: "var(--text-muted)", border: "1px solid var(--border-light)", borderRadius: "12px", fontSize: "0.875rem", cursor: "pointer", fontFamily: "DM Sans, sans-serif" }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(200,169,110,0.3)")}
            onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border-light)")}
          >
            Back to dashboard
          </button>
        </div>
      </div>
    </main>
  );
}