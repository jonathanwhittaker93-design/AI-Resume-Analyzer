"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { login as loginApi, signup as signupApi } from "@/lib/api";
import { getErrorMessage } from "@/lib/error";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);
  const [confirmedEmail, setConfirmedEmail] = useState("");
  const { login, token, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!authLoading && token) router.replace("/dashboard");
  }, [token, authLoading, router]);

  useEffect(() => {
    const confirmed = searchParams.get("confirmed");
    const emailParam = searchParams.get("email");
    if (confirmed === "true" && emailParam) {
      setAwaitingConfirmation(true);
      setConfirmedEmail(decodeURIComponent(emailParam));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isLogin) {
        const res = await loginApi(email, password);
        login(res.data.access_token);
        router.push("/dashboard");
      } else {
        const res = await signupApi(email, password, fullName);
        if (res.data.requires_confirmation) {
          router.replace(`/auth?confirmed=true&email=${encodeURIComponent(email)}`);
        } else {
          login(res.data.access_token);
          router.push("/dashboard");
        }
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (awaitingConfirmation) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4" style={{background:"var(--bg)"}}>
        <div className="w-full max-w-sm text-center">
          <span className="font-display text-2xl" style={{color:"var(--gold)"}}>Resumé</span>

          <div className="rounded-2xl p-10 mt-8" style={{background:"var(--surface)", border:"1px solid var(--border)"}}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-5" style={{background:"rgba(200,169,110,0.1)", border:"1px solid rgba(200,169,110,0.3)"}}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c8a96e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
            </div>
            <h2 className="font-display text-2xl font-light mb-3" style={{color:"var(--text)"}}>Check your email</h2>
            <p className="text-sm leading-relaxed mb-1" style={{color:"var(--text-muted)"}}>We sent a confirmation link to</p>
            <p className="text-sm font-medium mb-6" style={{color:"var(--gold)"}}>{confirmedEmail}</p>
            <p className="text-xs leading-relaxed" style={{color:"var(--text-dim)"}}>
              Click the link in the email to activate your account, then come back here to sign in.
            </p>
          </div>

          <button
            onClick={() => router.replace("/auth")}
            className="mt-6 bg-transparent border-none cursor-pointer text-sm transition-colors"
            style={{color:"var(--gold)"}}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--gold-light)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--gold)")}
          >
            Back to sign in
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4" style={{background:"var(--bg)"}}>
      <div className="w-full max-w-sm">

        <div className="text-center mb-10">
          <span
            className="font-display text-2xl cursor-pointer transition-colors"
            style={{color:"var(--gold)"}}
            onClick={() => router.push("/")}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--gold-light)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--gold)")}
          >
            Resumé
          </span>
          <p className="mt-2 text-sm" style={{color:"var(--text-muted)"}}>
            {isLogin ? "Welcome back" : "Create your account"}
          </p>
        </div>

        <div className="rounded-2xl p-8" style={{background:"var(--surface)", border:"1px solid var(--border)"}}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {!isLogin && (
              <div className="flex flex-col gap-2">
                <label className="text-xs tracking-wide" style={{color:"var(--text-muted)"}}>Full name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Full name"
                  className="w-full rounded-lg px-4 py-3 text-sm outline-none transition-colors"
                  style={{background:"var(--bg)", border:"1px solid var(--border-light)", color:"var(--text)"}}
                />
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="text-xs tracking-wide" style={{color:"var(--text-muted)"}}>Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full rounded-lg px-4 py-3 text-sm outline-none transition-colors"
                style={{background:"var(--bg)", border:"1px solid var(--border-light)", color:"var(--text)"}}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs tracking-wide" style={{color:"var(--text-muted)"}}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full rounded-lg px-4 py-3 text-sm outline-none transition-colors"
                style={{background:"var(--bg)", border:"1px solid var(--border-light)", color:"var(--text)"}}
              />
            </div>

            {error && (
              <div className="px-4 py-3 rounded-lg" style={{background:"var(--red-dim)"}}>
                <p className="text-xs" style={{color:"var(--red)"}}>{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-lg text-sm font-medium transition-colors"
              style={{
                background: loading ? "var(--border-light)" : "var(--gold)",
                color: loading ? "var(--text-dim)" : "#0a0808",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer"
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "var(--gold-light)"; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = "var(--gold)"; }}
            >
              {loading ? "Please wait..." : isLogin ? "Sign in" : "Create account"}
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-sm" style={{color:"var(--text-dim)"}}>
          {isLogin ? "No account yet?" : "Already have an account?"}{" "}
          <button
            onClick={() => { setIsLogin(!isLogin); setError(""); }}
            className="bg-transparent border-none cursor-pointer text-sm transition-colors"
            style={{color:"var(--gold)"}}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--gold-light)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--gold)")}
          >
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </main>
  );
}