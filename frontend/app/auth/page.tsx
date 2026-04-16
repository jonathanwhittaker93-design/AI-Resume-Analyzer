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

  useEffect(() => {
    if (!authLoading && token) router.replace("/dashboard");
  }, [token, authLoading, router]);
  const router = useRouter();
  const searchParams = useSearchParams();

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
      <main style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
        <div style={{ width: "100%", maxWidth: "400px", textAlign: "center" }}>
          <span className="font-display" style={{ fontSize: "1.75rem", color: "var(--gold)" }}>Resumé</span>

          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "2.5rem 2rem", marginTop: "2rem" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "rgba(200,169,110,0.1)", border: "1px solid rgba(200,169,110,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
            </div>

            <h2 className="font-display" style={{ fontSize: "1.5rem", fontWeight: 300, color: "var(--text)", marginBottom: "0.75rem" }}>
              Check your email
            </h2>
            <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: "0.5rem" }}>
              We sent a confirmation link to
            </p>
            <p style={{ fontSize: "0.875rem", color: "var(--gold)", marginBottom: "1.5rem", fontWeight: 500 }}>
              {confirmedEmail}
            </p>
            <p style={{ fontSize: "0.8rem", color: "var(--text-dim)", lineHeight: 1.6 }}>
              Click the link in the email to activate your account, then come back here to sign in.
            </p>
          </div>

          <button
            onClick={() => router.replace("/auth")}
            style={{ marginTop: "1.5rem", background: "none", border: "none", color: "var(--gold)", cursor: "pointer", fontSize: "0.875rem" }}
          >
            Back to sign in
          </button>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <div style={{ width: "100%", maxWidth: "400px" }}>

        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <span
            className="font-display"
            style={{ fontSize: "1.75rem", color: "var(--gold)", cursor: "pointer" }}
            onClick={() => router.push("/")}
          >
            Resumé
          </span>
          <p style={{ marginTop: "0.5rem", fontSize: "0.875rem", color: "var(--text-muted)" }}>
            {isLogin ? "Welcome back" : "Create your account"}
          </p>
        </div>

        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "2rem" }}>
          <form onSubmit={handleSubmit}>

            {!isLogin && (
              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.5rem", letterSpacing: "0.05em" }}>Full name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Jonathan Whittaker"
                  style={{ width: "100%", background: "var(--bg)", border: "1px solid var(--border-light)", borderRadius: "8px", padding: "0.75rem 1rem", color: "var(--text)", fontSize: "0.875rem", outline: "none", fontFamily: "DM Sans, sans-serif" }}
                />
              </div>
            )}

            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.5rem", letterSpacing: "0.05em" }}>Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                style={{ width: "100%", background: "var(--bg)", border: "1px solid var(--border-light)", borderRadius: "8px", padding: "0.75rem 1rem", color: "var(--text)", fontSize: "0.875rem", outline: "none", fontFamily: "DM Sans, sans-serif" }}
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.5rem", letterSpacing: "0.05em" }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={{ width: "100%", background: "var(--bg)", border: "1px solid var(--border-light)", borderRadius: "8px", padding: "0.75rem 1rem", color: "var(--text)", fontSize: "0.875rem", outline: "none", fontFamily: "DM Sans, sans-serif" }}
              />
            </div>

            {error && (
              <div style={{ marginBottom: "1rem", padding: "0.75rem 1rem", background: "var(--red-dim)", borderRadius: "8px" }}>
                <p style={{ fontSize: "0.8rem", color: "var(--red)" }}>{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{ width: "100%", padding: "0.875rem", background: loading ? "var(--border-light)" : "var(--gold)", color: loading ? "var(--text-dim)" : "#0a0808", border: "none", borderRadius: "8px", fontSize: "0.875rem", fontWeight: 500, cursor: loading ? "not-allowed" : "pointer", fontFamily: "DM Sans, sans-serif" }}
            >
              {loading ? "Please wait..." : isLogin ? "Sign in" : "Create account"}
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.875rem", color: "var(--text-dim)" }}>
          {isLogin ? "No account yet?" : "Already have an account?"}{" "}
          <button
            onClick={() => { setIsLogin(!isLogin); setError(""); }}
            style={{ background: "none", border: "none", color: "var(--gold)", cursor: "pointer", fontSize: "0.875rem" }}
          >
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </main>
  );
}