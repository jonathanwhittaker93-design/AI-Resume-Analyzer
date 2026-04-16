"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { login as loginApi, signup as signupApi } from "@/lib/api";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = isLogin
        ? await loginApi(email, password)
        : await signupApi(email, password, fullName);
      login(res.data.access_token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <div style={{ width: "100%", maxWidth: "400px" }}>

        {/* Logo */}
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

        {/* Card */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "2rem" }}>
          <form onSubmit={handleSubmit}>

            {!isLogin && (
              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.5rem", letterSpacing: "0.05em" }}>
                  Full name
                </label>
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
              <label style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.5rem", letterSpacing: "0.05em" }}>
                Email address
              </label>
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
              <label style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.5rem", letterSpacing: "0.05em" }}>
                Password
              </label>
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

        {/* Toggle */}
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