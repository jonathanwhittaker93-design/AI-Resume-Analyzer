"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { uploadResume, analyzeResume } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function AnalyzePage() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("");
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !jobDescription) return;
    setError("");
    setLoading(true);
    try {
      setStep("Uploading resume...");
      const uploadRes = await uploadResume(file);
      const { storage_path, filename } = uploadRes.data;
      setStep("Analyzing with Claude...");
      const analyzeRes = await analyzeResume(storage_path, filename, jobDescription);
      router.push(`/results/${analyzeRes.data.id}`);
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setError(detail || "Something went wrong.");
      setLoading(false);
      setStep("");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.type === "application/pdf") setFile(dropped);
  };

  const canSubmit = !loading && !!file && !!jobDescription;

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
              onClick={() => router.push("/dashboard")}
              style={{ fontSize: "0.875rem", padding: "0.6rem 1.25rem", background: "var(--gold)", color: "#0a0808", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 500, fontFamily: "DM Sans, sans-serif" }}
              onMouseEnter={e => (e.currentTarget.style.background = "var(--gold-light)")}
              onMouseLeave={e => (e.currentTarget.style.background = "var(--gold)")}
            >
              Dashboard
            </button>
            <button
              onClick={() => { logout(); router.push("/auth"); }}
              style={{ fontSize: "0.875rem", padding: "0.6rem 1.25rem", background: "transparent", color: "var(--text-dim)", border: "1px solid var(--border)", borderRadius: "8px", cursor: "pointer", fontFamily: "DM Sans, sans-serif" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--text-muted)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text-dim)")}
            >
              Sign out
            </button>
          </div>
        </div>

        <h1 className="font-display" style={{ fontSize: "2.75rem", fontWeight: 300, color: "var(--text)", marginBottom: "0.5rem" }}>
          New Analysis
        </h1>
        <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "2.5rem", fontWeight: 300 }}>
          Upload your resume and paste a job description to get your score.
        </p>

        <form onSubmit={handleSubmit}>

          <div style={{ background: "var(--surface)", border: `1px solid ${dragOver ? "var(--gold)" : file ? "rgba(200,169,110,0.4)" : "var(--border)"}`, borderRadius: "16px", marginBottom: "1rem", overflow: "hidden" }}>
            <div style={{ padding: "1.25rem 1.75rem", borderBottom: "1px solid var(--border)" }}>
              <p style={{ fontSize: "0.65rem", color: "var(--gold)", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 500 }}>Resume</p>
            </div>
            <div
              style={{ padding: "2.5rem 1.75rem", textAlign: "center", cursor: "pointer" }}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById("resume-upload")?.click()}
            >
              <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} style={{ display: "none" }} id="resume-upload" />
              {file ? (
                <div>
                  <p style={{ fontSize: "0.925rem", color: "var(--gold)", fontWeight: 400, marginBottom: "0.25rem" }}>{file.name}</p>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>{(file.size / 1024 / 1024).toFixed(2)} MB — click to change</p>
                </div>
              ) : (
                <div>
                  <p style={{ fontSize: "0.925rem", color: "var(--text-muted)", marginBottom: "0.35rem", fontWeight: 300 }}>Drop your PDF here</p>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>or click to browse — maximum file size 5MB</p>
                </div>
              )}
            </div>
          </div>

          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", marginBottom: "1.5rem", overflow: "hidden" }}>
            <div style={{ padding: "1.25rem 1.75rem", borderBottom: "1px solid var(--border)" }}>
              <p style={{ fontSize: "0.65rem", color: "var(--gold)", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 500 }}>Job Description</p>
            </div>
            <div style={{ padding: "1.5rem 1.75rem" }}>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                required
                rows={10}
                style={{ width: "100%", background: "transparent", border: "none", outline: "none", color: "var(--text-muted)", fontSize: "0.875rem", lineHeight: 1.75, fontFamily: "DM Sans, sans-serif", fontWeight: 300, resize: "none" }}
                placeholder="Paste the full job description here..."
              />
            </div>
          </div>

          {error && (
            <div style={{ marginBottom: "1rem", padding: "0.875rem 1.25rem", background: "var(--red-dim)", borderRadius: "10px" }}>
              <p style={{ fontSize: "0.825rem", color: "var(--red)" }}>{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={!canSubmit}
            style={{ width: "100%", padding: "1rem", background: canSubmit ? "var(--gold)" : "var(--border-light)", color: canSubmit ? "#0a0808" : "var(--text-dim)", border: "none", borderRadius: "12px", fontSize: "0.875rem", fontWeight: 500, cursor: canSubmit ? "pointer" : "not-allowed", fontFamily: "DM Sans, sans-serif", letterSpacing: "0.02em", transition: "background 0.2s" }}
            onMouseEnter={e => { if (canSubmit) e.currentTarget.style.background = "var(--gold-light)"; }}
            onMouseLeave={e => { if (canSubmit) e.currentTarget.style.background = "var(--gold)"; }}
          >
            {loading ? step : "Analyze Resume"}
          </button>
        </form>
      </div>
    </main>
  );
}