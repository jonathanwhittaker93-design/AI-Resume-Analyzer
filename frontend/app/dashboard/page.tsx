"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAnalyses, deleteAnalysis } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface Analysis {
  id: string;
  resume_filename: string;
  match_score: number;
  created_at: string;
  summary: string;
}

export default function DashboardPage() {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    getAnalyses()
      .then((res) => setAnalyses(res.data))
      .catch(() => router.push("/auth"))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteAnalysis(id);
    setAnalyses(analyses.filter((a) => a.id !== id));
  };

  const scoreColor = (score: number) =>
    score >= 70 ? "var(--green)" : score >= 40 ? "var(--yellow)" : "var(--red)";

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", padding: "2.5rem 1.5rem" }}>
      <div style={{ maxWidth: "680px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "3rem" }}>
          <div>
            <span className="font-display" style={{ fontSize: "1.4rem", color: "var(--gold)" }}>Resumé</span>
            <p style={{ fontSize: "0.75rem", color: "var(--text-dim)", marginTop: "0.25rem" }}>{user?.email}</p>
          </div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              onClick={() => router.push("/analyze")}
              style={{ fontSize: "0.875rem", padding: "0.6rem 1.25rem", background: "var(--gold)", color: "#0a0808", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 500, fontFamily: "DM Sans, sans-serif" }}
            >
              New analysis
            </button>
            <button
              onClick={() => { logout(); router.push("/auth"); }}
              style={{ fontSize: "0.875rem", padding: "0.6rem 1.25rem", background: "transparent", color: "var(--text-dim)", border: "1px solid var(--border)", borderRadius: "8px", cursor: "pointer", fontFamily: "DM Sans, sans-serif" }}
            >
              Sign out
            </button>
          </div>
        </div>

        <h1 className="font-display" style={{ fontSize: "2.75rem", fontWeight: 300, color: "var(--text)", marginBottom: "2rem" }}>
          Your analyses
        </h1>

        {loading ? (
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Loading...</p>
        ) : analyses.length === 0 ? (
          <div style={{ background: "var(--surface)", border: "1px dashed var(--border-light)", borderRadius: "16px", padding: "4rem", textAlign: "center" }}>
            <p className="font-display" style={{ fontSize: "1.75rem", color: "var(--text-muted)", fontWeight: 300, marginBottom: "0.5rem" }}>Nothing here yet</p>
            <p style={{ fontSize: "0.875rem", color: "var(--text-dim)", marginBottom: "1.5rem" }}>Upload your first resume to get started.</p>
            <button
              onClick={() => router.push("/analyze")}
              style={{ fontSize: "0.875rem", padding: "0.75rem 1.5rem", background: "var(--gold)", color: "#0a0808", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 500, fontFamily: "DM Sans, sans-serif" }}
            >
              Analyze a resume
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {analyses.map((analysis) => (
              <div
                key={analysis.id}
                onClick={() => router.push(`/results/${analysis.id}`)}
                style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "12px", padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", gap: "1.25rem", cursor: "pointer" }}
              >
                {/* Score bubble */}
                <div style={{ width: "52px", height: "52px", borderRadius: "10px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: `${scoreColor(analysis.match_score)}15`, border: `1px solid ${scoreColor(analysis.match_score)}40` }}>
                  <span className="font-display" style={{ fontSize: "1.25rem", color: scoreColor(analysis.match_score), fontWeight: 300 }}>
                    {analysis.match_score}
                  </span>
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: "0.9rem", fontWeight: 500, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {analysis.resume_filename}
                  </p>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-dim)", marginTop: "0.2rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {analysis.summary?.slice(0, 80)}...
                  </p>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-dim)", marginTop: "0.3rem" }}>
                    {new Date(analysis.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>

                {/* Delete */}
                <button
                  onClick={(e) => handleDelete(analysis.id, e)}
                  style={{ fontSize: "0.75rem", padding: "0.4rem 0.75rem", background: "transparent", color: "var(--text-dim)", border: "1px solid transparent", borderRadius: "6px", cursor: "pointer", flexShrink: 0, fontFamily: "DM Sans, sans-serif" }}
                  onMouseEnter={e => { e.currentTarget.style.color = "var(--red)"; e.currentTarget.style.background = "var(--red-dim)"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = "var(--text-dim)"; e.currentTarget.style.background = "transparent"; }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}