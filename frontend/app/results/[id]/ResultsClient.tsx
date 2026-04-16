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

export default function ResultsClient() {
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
    <main className="min-h-screen flex items-center justify-center" style={{background:"var(--bg)"}}>
      <p className="text-sm" style={{color:"var(--text-muted)"}}>Loading results...</p>
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
    <div className="rounded-2xl mb-4 overflow-hidden" style={{background:"var(--surface)", border:"1px solid var(--border)"}}>
      <div className="px-7 py-5 flex items-center justify-between" style={{borderBottom:"1px solid var(--border)"}}>
        <p className="text-xs font-medium tracking-widest uppercase" style={{color:"var(--gold)"}}>{label}</p>
        <p className="text-xs" style={{color:"var(--text-dim)"}}>{hint}</p>
      </div>
      {children}
    </div>
  );

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
              onClick={() => router.push("/analyze")}
              className="text-sm px-5 py-2 rounded-lg font-medium cursor-pointer transition-colors"
              style={{background:"var(--gold)", color:"#0a0808", border:"none"}}
              onMouseEnter={e => (e.currentTarget.style.background = "var(--gold-light)")}
              onMouseLeave={e => (e.currentTarget.style.background = "var(--gold)")}
            >
              New analysis
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className="text-sm px-5 py-2 rounded-lg cursor-pointer transition-colors"
              style={{background:"transparent", color:"var(--text-dim)", border:"1px solid var(--border)"}}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--text-muted)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text-dim)")}
            >
              Dashboard
            </button>
          </div>
        </div>

        <h1 className="font-display font-light mb-1" style={{fontSize:"2.75rem", color:"var(--text)"}}>
          Analysis Results
        </h1>
        <p className="text-xs mb-10" style={{color:"var(--text-dim)"}}>
          {analysis.resume_filename} analyzed on {new Date(analysis.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
        </p>

        {section("Match Score", scoreLabel, (
          <div className="p-7">
            <div className="flex items-end gap-5 mb-6">
              <span className="font-display font-light" style={{fontSize:"5rem", lineHeight:1, color:scoreColor}}>
                {analysis.match_score}
              </span>
              <div className="pb-2">
                <p className="text-xs tracking-widest uppercase mb-1.5" style={{color:"var(--text-dim)"}}>out of 100</p>
                <div className="flex gap-0.5">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-0.5 w-5 rounded-sm"
                      style={{background: i < Math.round(analysis.match_score / 10) ? scoreColor : "var(--border-light)"}}
                    />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-sm font-light leading-relaxed" style={{color:"var(--text-muted)"}}>{analysis.summary}</p>
          </div>
        ))}

        {section("Strengths", `${analysis.strengths.length} identified`, (
          <div>
            {analysis.strengths.map((s, i) => (
              <div
                key={i}
                className="flex gap-6 items-start px-7 py-4"
                style={{borderBottom: i < analysis.strengths.length - 1 ? "1px solid var(--border)" : "none"}}
              >
                <span className="font-display text-xl shrink-0 leading-none pt-0.5" style={{color:"var(--gold)", opacity:0.35, minWidth:"1.25rem", textAlign:"right"}}>{i + 1}</span>
                <p className="text-sm font-light leading-relaxed" style={{color:"var(--text-muted)"}}>{s}</p>
              </div>
            ))}
          </div>
        ))}

        {section("Missing Keywords", "Add these to your resume", (
          <div className="px-7 py-6 flex flex-wrap gap-2">
            {analysis.missing_keywords.map((kw, i) => (
              <span
                key={i}
                className="text-sm px-4 py-1.5 rounded-lg font-light"
                style={{background:"rgba(200,169,110,0.07)", color:"var(--gold)", border:"1px solid rgba(200,169,110,0.18)"}}
              >
                {kw}
              </span>
            ))}
          </div>
        ))}

        {section("Suggestions", "How to improve", (
          <div>
            {analysis.suggestions.map((s, i) => (
              <div
                key={i}
                className="flex gap-6 items-start px-7 py-4"
                style={{borderBottom: i < analysis.suggestions.length - 1 ? "1px solid var(--border)" : "none"}}
              >
                <span className="font-display text-xl shrink-0 leading-none pt-0.5" style={{color:"var(--gold)", opacity:0.35, minWidth:"1.25rem", textAlign:"right"}}>{i + 1}</span>
                <p className="text-sm font-light leading-relaxed" style={{color:"var(--text-muted)"}}>{s}</p>
              </div>
            ))}
          </div>
        ))}

        <div className="grid grid-cols-2 gap-3 mt-2">
          <button
            onClick={() => router.push("/analyze")}
            className="py-4 rounded-xl text-sm font-medium cursor-pointer transition-colors"
            style={{background:"var(--gold)", color:"#0a0808", border:"none"}}
            onMouseEnter={e => (e.currentTarget.style.background = "var(--gold-light)")}
            onMouseLeave={e => (e.currentTarget.style.background = "var(--gold)")}
          >
            Analyze another
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            className="py-4 rounded-xl text-sm cursor-pointer transition-colors"
            style={{background:"transparent", color:"var(--text-muted)", border:"1px solid var(--border-light)"}}
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

export function generateStaticParams() {
  return [];
}