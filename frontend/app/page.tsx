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
        <p className="text-xs" style={{color:"var(--text-dim)"}}>{user?.email}</p>
        <button
          onClick={() => router.push("/dashboard")}
          className="text-sm px-5 py-2 rounded-lg cursor-pointer transition-colors"
          style={{background:"transparent", color:"var(--text-dim)", border:"1px solid var(--border)"}}
          onMouseEnter={e => (e.currentTarget.style.color = "var(--text-muted)")}
          onMouseLeave={e => (e.currentTarget.style.color = "var(--text-dim)")}
        >
          Dashboard
        </button>
        <button
          onClick={() => router.push("/analyze")}
          className="text-sm px-5 py-2 rounded-lg cursor-pointer font-medium transition-colors"
          style={{background:"var(--gold)", color:"#0a0808", border:"none"}}
          onMouseEnter={e => (e.currentTarget.style.background = "var(--gold-light)")}
          onMouseLeave={e => (e.currentTarget.style.background = "var(--gold)")}
        >
          New analysis
        </button>
      </div>
    );
    return (
      <div className="flex gap-3">
        <button
          onClick={() => router.push("/auth")}
          className="text-sm px-5 py-2 rounded-lg cursor-pointer transition-colors"
          style={{background:"transparent", color:"var(--text-muted)", border:"1px solid var(--border-light)"}}
          onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
          onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
        >
          Sign in
        </button>
        <button
          onClick={() => router.push("/auth")}
          className="text-sm px-5 py-2 rounded-lg cursor-pointer font-medium transition-colors"
          style={{background:"var(--gold)", color:"#0a0808", border:"none"}}
          onMouseEnter={e => (e.currentTarget.style.background = "var(--gold-light)")}
          onMouseLeave={e => (e.currentTarget.style.background = "var(--gold)")}
        >
          Get started
        </button>
      </div>
    );
  };

  return (
    <main className="min-h-screen flex flex-col" style={{background:"var(--bg)"}}>
      <nav className="flex items-center justify-between px-10 py-6">
        <span className="font-display text-xl tracking-wide" style={{color:"var(--gold)"}}>
          Resumé
        </span>
        {renderNav()}
      </nav>

      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 pb-24">
        <p className="text-xs tracking-widest uppercase mb-8" style={{color:"var(--gold)"}}>
          Powered by Claude AI
        </p>

        <h1 className="font-display text-6xl md:text-7xl lg:text-8xl leading-tight font-light mb-6" style={{color:"var(--text)"}}>
          Your resume,<br />
          <em className="italic" style={{color:"var(--gold)"}}>perfected.</em>
        </h1>

        <p className="text-lg font-light max-w-lg leading-relaxed mb-10" style={{color:"var(--text-muted)"}}>
          Upload your resume, paste a job description, and receive a precise match score with tailored feedback in seconds.
        </p>

        {!loading && (
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => router.push(token ? "/analyze" : "/auth")}
              className="text-sm px-8 py-3.5 rounded-xl cursor-pointer font-medium transition-colors"
              style={{background:"var(--gold)", color:"#0a0808", border:"none"}}
              onMouseEnter={e => (e.currentTarget.style.background = "var(--gold-light)")}
              onMouseLeave={e => (e.currentTarget.style.background = "var(--gold)")}
            >
              {token ? "New analysis" : "Analyze my resume"}
            </button>
            {!token && (
              <button
                onClick={() => router.push("/auth")}
                className="text-sm px-8 py-3.5 rounded-xl cursor-pointer transition-colors"
                style={{background:"transparent", color:"var(--text-muted)", border:"1px solid var(--border-light)"}}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
              >
                Sign in
              </button>
            )}
          </div>
        )}

        <div className="flex gap-16 mt-20 pt-8" style={{borderTop:"1px solid var(--border)"}}>
          {[
            { value: "0/100", label: "Match score" },
            { value: "Instant", label: "Results" },
            { value: "Free", label: "To start" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-3xl font-light" style={{color:"var(--text)"}}>{s.value}</p>
              <p className="text-xs mt-1" style={{color:"var(--text-dim)"}}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}