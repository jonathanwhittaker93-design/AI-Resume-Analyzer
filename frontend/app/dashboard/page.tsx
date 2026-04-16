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

function SkeletonCard() {
  return (
    <div className="bg-[#0f0f1a] border border-[#1e1e30] rounded-xl p-5 flex items-center gap-5">
      <div className="shrink-0 rounded-lg bg-[#1e1e30] animate-pulse" style={{width:"52px",height:"52px"}} />
      <div className="flex-1 flex flex-col gap-2">
        <div className="h-3 rounded bg-[#1e1e30] animate-pulse w-1/2" />
        <div className="h-2.5 rounded bg-[#1e1e30] animate-pulse w-4/5" />
        <div className="h-2 rounded bg-[#1e1e30] animate-pulse w-1/4" />
      </div>
    </div>
  );
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
  }, [router]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteAnalysis(id);
    setAnalyses(analyses.filter((a) => a.id !== id));
  };

  const scoreStyles = (score: number) =>
    score >= 70
      ? { color: "#4caf88", bg: "rgba(76,175,136,0.12)", border: "1px solid rgba(76,175,136,0.3)" }
      : score >= 40
      ? { color: "#d4a853", bg: "rgba(212,168,83,0.12)", border: "1px solid rgba(212,168,83,0.3)" }
      : { color: "#e07070", bg: "rgba(224,112,112,0.12)", border: "1px solid rgba(224,112,112,0.3)" };

  return (
    <main className="min-h-screen bg-[#08080f] py-10 px-6">
      <div className="max-w-2xl mx-auto">

        {/* Nav */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <span className="font-display text-xl" style={{color:"#c8a96e"}}>Resumé</span>
            <p className="text-xs mt-1" style={{color:"#4a4a64"}}>{user?.email}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.push("/analyze")}
              className="text-sm px-5 py-2 rounded-lg font-medium cursor-pointer transition-colors"
              style={{background:"#c8a96e", color:"#0a0808"}}
            >
              New analysis
            </button>
            <button
              onClick={() => { logout(); router.push("/auth"); }}
              className="text-sm px-5 py-2 rounded-lg cursor-pointer transition-colors"
              style={{background:"transparent", color:"#4a4a64", border:"1px solid #1e1e30"}}
            >
              Sign out
            </button>
          </div>
        </div>

        <h1 className="font-display font-light mb-8" style={{fontSize:"2.75rem", color:"#ede8df"}}>
          Your Analyses
        </h1>

        {loading ? (
          <div className="flex flex-col gap-3">
            {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : analyses.length === 0 ? (
          <div className="rounded-2xl p-16 text-center" style={{background:"#0f0f1a", border:"1px dashed #2a2a40"}}>
            <p className="font-display text-3xl font-light mb-2" style={{color:"#7a7a96"}}>Nothing here yet</p>
            <p className="text-sm mb-6" style={{color:"#4a4a64"}}>Upload your first resume to get started.</p>
            <button
              onClick={() => router.push("/analyze")}
              className="text-sm px-6 py-3 rounded-lg font-medium cursor-pointer"
              style={{background:"#c8a96e", color:"#0a0808"}}
            >
              Analyze a resume
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {analyses.map((analysis) => {
              const s = scoreStyles(analysis.match_score);
              return (
                <div
                  key={analysis.id}
                  onClick={() => router.push(`/results/${analysis.id}`)}
                  className="rounded-xl p-5 flex items-center gap-5 cursor-pointer transition-colors"
                  style={{background:"#0f0f1a", border:"1px solid #1e1e30"}}
                >
                  <div className="shrink-0 flex items-center justify-center" style={{width:"52px"}}>
                    <span className="font-display font-light" style={{fontSize:"1.75rem", color:s.color}}>
                      {analysis.match_score}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{color:"#ede8df"}}>
                      {analysis.resume_filename}
                    </p>
                    <p className="text-xs mt-0.5 truncate" style={{color:"#4a4a64"}}>
                      {analysis.summary?.slice(0, 80)}...
                    </p>
                    <p className="text-xs mt-1" style={{color:"#4a4a64"}}>
                      {new Date(analysis.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>

                  <button
                    onClick={(e) => handleDelete(analysis.id, e)}
                    className="text-xs px-3 py-1.5 rounded-md cursor-pointer shrink-0 transition-colors"
                    style={{background:"transparent", color:"#4a4a64", border:"1px solid transparent"}}
                    onMouseEnter={e => { e.currentTarget.style.color = "#e07070"; e.currentTarget.style.background = "rgba(224,112,112,0.12)"; }}
                    onMouseLeave={e => { e.currentTarget.style.color = "#4a4a64"; e.currentTarget.style.background = "transparent"; }}
                  >
                    Delete
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}