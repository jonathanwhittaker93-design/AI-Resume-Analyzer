"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { uploadResume, analyzeResume } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { getErrorMessage } from "@/lib/error";

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
      setError(getErrorMessage(err));
      setLoading(false);
      setStep("");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.type === "application/pdf") {
      setFile(dropped);
    } else {
      setError("Only PDF files are accepted. Please upload a PDF.");
    }
  };

  const canSubmit = !loading && !!file && !!jobDescription;

  return (
    <main className="min-h-screen py-10 px-6" style={{background:"var(--bg)"}}>
      <div className="max-w-2xl mx-auto">

        {/* Nav */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <span className="font-display text-xl" style={{color:"var(--gold)"}}>Resumé</span>
            <p className="text-xs mt-1" style={{color:"var(--text-dim)"}}>{user?.email}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="text-sm px-5 py-2 rounded-lg font-medium cursor-pointer transition-colors"
              style={{background:"var(--gold)", color:"#0a0808", border:"none"}}
              onMouseEnter={e => (e.currentTarget.style.background = "var(--gold-light)")}
              onMouseLeave={e => (e.currentTarget.style.background = "var(--gold)")}
            >
              Dashboard
            </button>
            <button
              onClick={() => { logout(); router.push("/auth"); }}
              className="text-sm px-5 py-2 rounded-lg cursor-pointer transition-colors"
              style={{background:"transparent", color:"var(--text-dim)", border:"1px solid var(--border)"}}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--text-muted)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text-dim)")}
            >
              Sign out
            </button>
          </div>
        </div>

        <h1 className="font-display font-light mb-2" style={{fontSize:"2.75rem", color:"var(--text)"}}>
          New Analysis
        </h1>
        <p className="text-sm font-light mb-10" style={{color:"var(--text-muted)"}}>
          Upload your resume and paste a job description to get your score.
        </p>

        <form onSubmit={handleSubmit}>

          {/* Upload */}
          <div
            className="rounded-2xl mb-4 overflow-hidden"
            style={{
              background:"var(--surface)",
              border:`1px solid ${dragOver ? "var(--gold)" : file ? "rgba(200,169,110,0.4)" : "var(--border)"}`
            }}
          >
            <div className="px-7 py-5" style={{borderBottom:"1px solid var(--border)"}}>
              <p className="text-xs font-medium tracking-widest uppercase" style={{color:"var(--gold)"}}>Resume</p>
            </div>
            <div
              className="px-7 py-10 text-center cursor-pointer"
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById("resume-upload")?.click()}
            >
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
                id="resume-upload"
              />
              {file ? (
                <div>
                  <p className="text-sm font-normal mb-1" style={{color:"var(--gold)"}}>{file.name}</p>
                  <p className="text-xs" style={{color:"var(--text-dim)"}}>{(file.size / 1024 / 1024).toFixed(2)} MB — click to change</p>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-light mb-1" style={{color:"var(--text-muted)"}}>Drop your PDF here</p>
                  <p className="text-xs" style={{color:"var(--text-dim)"}}>or click to browse maximum file size 5MB</p>
                </div>
              )}
            </div>
          </div>

          {/* Job Description */}
          <div className="rounded-2xl mb-6 overflow-hidden" style={{background:"var(--surface)", border:"1px solid var(--border)"}}>
            <div className="px-7 py-5" style={{borderBottom:"1px solid var(--border)"}}>
              <p className="text-xs font-medium tracking-widest uppercase" style={{color:"var(--gold)"}}>Job Description</p>
            </div>
            <div className="px-7 py-6">
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                required
                rows={10}
                className="w-full text-sm font-light resize-none outline-none"
                style={{background:"transparent", border:"none", color:"var(--text-muted)", lineHeight:1.75}}
                placeholder="Paste the full job description here..."
              />
            </div>
          </div>

          {error && (
            <div className="mb-4 px-5 py-3.5 rounded-xl" style={{background:"var(--red-dim)"}}>
              <p className="text-sm" style={{color:"var(--red)"}}>{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full py-4 rounded-xl text-sm font-medium tracking-wide transition-colors"
            style={{
              background: canSubmit ? "var(--gold)" : "var(--border-light)",
              color: canSubmit ? "#0a0808" : "var(--text-dim)",
              border:"none",
              cursor: canSubmit ? "pointer" : "not-allowed"
            }}
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