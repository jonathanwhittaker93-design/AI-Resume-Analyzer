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
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-6 py-5 flex items-center gap-5">
      <div className="w-13 h-13 rounded-xl bg-zinc-800 animate-pulse shrink-0" />
      <div className="flex-1 flex flex-col gap-2">
        <div className="h-3.5 rounded bg-zinc-800 animate-pulse w-1/2" />
        <div className="h-3 rounded bg-zinc-800 animate-pulse w-4/5" />
        <div className="h-2.5 rounded bg-zinc-800 animate-pulse w-1/4" />
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

  const scoreColor = (score: number) =>
    score >= 70
      ? { text: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/30" }
      : score >= 40
      ? { text: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/30" }
      : { text: "text-red-400", bg: "bg-red-400/10", border: "border-red-400/30" };

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10">
      <div className="max-w-2xl mx-auto">

        <div className="flex items-center justify-between mb-12">
          <div>
            <span className="font-display text-xl text-gold">Resumé</span>
            <p className="text-xs text-zinc-500 mt-1">{user?.email}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.push("/analyze")}
              className="text-sm px-5 py-2 bg-gold text-zinc-950 rounded-lg font-medium cursor-pointer hover:bg-gold-light transition-colors"
            >
              New analysis
            </button>
            <button
              onClick={() => { logout(); router.push("/auth"); }}
              className="text-sm px-5 py-2 bg-transparent text-zinc-500 border border-zinc-800 rounded-lg cursor-pointer hover:border-zinc-600 hover:text-stone-400 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>

        <h1 className="font-display text-5xl font-light text-stone-200 mb-8">
          Your analyses
        </h1>

        {loading ? (
          <div className="flex flex-col gap-3">
            {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : analyses.length === 0 ? (
          <div className="bg-zinc-900 border border-dashed border-zinc-700 rounded-2xl p-16 text-center">
            <p className="font-display text-3xl text-stone-400 font-light mb-2">Nothing here yet</p>
            <p className="text-sm text-zinc-500 mb-6">Upload your first resume to get started.</p>
            <button
              onClick={() => router.push("/analyze")}
              className="text-sm px-6 py-3 bg-gold text-zinc-950 rounded-lg font-medium cursor-pointer hover:bg-gold-light transition-colors"
            >
              Analyze a resume
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {analyses.map((analysis) => {
              const colors = scoreColor(analysis.match_score);
              return (
                <div
                  key={analysis.id}
                  onClick={() => router.push(`/results/${analysis.id}`)}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl px-6 py-5 flex items-center gap-5 cursor-pointer hover:border-gold/30 transition-colors"
                >
                  <div className={`w-13 h-13 rounded-xl shrink-0 flex items-center justify-center ${colors.bg} border ${colors.border}`}
                    style={{ width: "52px", height: "52px" }}>
                    <span className={`font-display text-xl font-light ${colors.text}`}>
                      {analysis.match_score}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-stone-200 truncate">
                      {analysis.resume_filename}
                    </p>
                    <p className="text-xs text-zinc-500 mt-0.5 truncate">
                      {analysis.summary?.slice(0, 80)}...
                    </p>
                    <p className="text-xs text-zinc-600 mt-1">
                      {new Date(analysis.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>

                  <button
                    onClick={(e) => handleDelete(analysis.id, e)}
                    className="text-xs px-3 py-1.5 bg-transparent text-zinc-600 border border-transparent rounded-md cursor-pointer shrink-0 hover:text-red-400 hover:bg-red-950/50 hover:border-red-900/50 transition-colors"
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