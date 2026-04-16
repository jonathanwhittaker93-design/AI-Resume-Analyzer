"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function HomePage() {
  const router = useRouter();
  const { token, loading, user } = useAuth();

  const renderNav = () => {
    if (loading) return <div className="w-44 h-9" />;
    if (token) return (
      <div className="flex items-center gap-3">
        <p className="text-xs text-zinc-500">{user?.email}</p>
        <button
          onClick={() => router.push("/dashboard")}
          className="text-sm px-5 py-2 bg-transparent text-stone-400 border border-zinc-700 rounded-lg cursor-pointer hover:border-zinc-500 hover:text-stone-300 transition-colors"
        >
          Dashboard
        </button>
        <button
          onClick={() => router.push("/analyze")}
          className="text-sm px-5 py-2 bg-gold text-zinc-950 border-none rounded-lg cursor-pointer font-medium hover:bg-gold-light transition-colors"
        >
          New analysis
        </button>
      </div>
    );
    return (
      <div className="flex gap-3">
        <button
          onClick={() => router.push("/auth")}
          className="text-sm px-5 py-2 bg-transparent text-stone-400 border border-zinc-700 rounded-lg cursor-pointer hover:border-zinc-500 hover:text-stone-300 transition-colors"
        >
          Sign in
        </button>
        <button
          onClick={() => router.push("/auth")}
          className="text-sm px-5 py-2 bg-gold text-zinc-950 border-none rounded-lg cursor-pointer font-medium hover:bg-gold-light transition-colors"
        >
          Get started
        </button>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-zinc-950 flex flex-col">
      <nav className="flex items-center justify-between px-10 py-6">
        <span className="font-display text-xl text-gold tracking-wide">
          Resumé
        </span>
        {renderNav()}
      </nav>

      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 pb-24">
        <p className="text-xs tracking-widest uppercase text-gold mb-8">
          Powered by Claude AI
        </p>

        <h1 className="font-display text-6xl md:text-7xl lg:text-8xl leading-tight text-stone-200 font-light mb-6">
          Your resume,<br />
          <em className="text-gold italic">perfected.</em>
        </h1>

        <p className="text-lg text-stone-400 font-light max-w-lg leading-relaxed mb-10">
          Upload your resume, paste a job description, and receive a precise match score with tailored feedback in seconds.
        </p>

        {!loading && (
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => router.push(token ? "/analyze" : "/auth")}
              className="text-sm px-8 py-3.5 bg-gold text-zinc-950 border-none rounded-xl cursor-pointer font-medium hover:bg-gold-light transition-colors"
            >
              {token ? "New analysis" : "Analyze my resume"}
            </button>
            {!token && (
              <button
                onClick={() => router.push("/auth")}
                className="text-sm px-8 py-3.5 bg-transparent text-stone-400 border border-zinc-700 rounded-xl cursor-pointer hover:border-zinc-500 hover:text-stone-300 transition-colors"
              >
                Sign in
              </button>
            )}
          </div>
        )}

        <div className="flex gap-16 mt-20 pt-8 border-t border-zinc-800">
          {[
            { value: "0/100", label: "Match score" },
            { value: "Instant", label: "Results" },
            { value: "Free", label: "To start" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-3xl text-stone-200 font-light">{s.value}</p>
              <p className="text-xs text-zinc-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}