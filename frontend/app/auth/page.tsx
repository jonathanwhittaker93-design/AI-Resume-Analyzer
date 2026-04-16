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
      <main className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="w-full max-w-sm text-center">
          <span className="font-display text-2xl text-gold">Resumé</span>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-10 mt-8">
            <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto mb-5">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c8a96e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
            </div>

            <h2 className="font-display text-2xl font-light text-stone-200 mb-3">Check your email</h2>
            <p className="text-sm text-stone-400 leading-relaxed mb-1">We sent a confirmation link to</p>
            <p className="text-sm text-gold font-medium mb-6">{confirmedEmail}</p>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Click the link in the email to activate your account, then come back here to sign in.
            </p>
          </div>

          <button
            onClick={() => router.replace("/auth")}
            className="mt-6 bg-transparent border-none text-gold cursor-pointer text-sm hover:text-gold-light transition-colors"
          >
            Back to sign in
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        <div className="text-center mb-10">
          <span
            className="font-display text-2xl text-gold cursor-pointer hover:text-gold-light transition-colors"
            onClick={() => router.push("/")}
          >
            Resumé
          </span>
          <p className="mt-2 text-sm text-stone-400">
            {isLogin ? "Welcome back" : "Create your account"}
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {!isLogin && (
              <div className="flex flex-col gap-2">
                <label className="text-xs text-stone-400 tracking-wide">Full name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Jonathan Whittaker"
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-3 text-stone-200 text-sm outline-none focus:border-gold/50 transition-colors placeholder:text-zinc-600"
                />
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="text-xs text-stone-400 tracking-wide">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-3 text-stone-200 text-sm outline-none focus:border-gold/50 transition-colors placeholder:text-zinc-600"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs text-stone-400 tracking-wide">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-3 text-stone-200 text-sm outline-none focus:border-gold/50 transition-colors placeholder:text-zinc-600"
              />
            </div>

            {error && (
              <div className="px-4 py-3 bg-red-950/50 border border-red-900/50 rounded-lg">
                <p className="text-xs text-red-400">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 rounded-lg text-sm font-medium transition-colors ${
                loading
                  ? "bg-zinc-700 text-zinc-500 cursor-not-allowed"
                  : "bg-gold text-zinc-950 hover:bg-gold-light cursor-pointer"
              }`}
            >
              {loading ? "Please wait..." : isLogin ? "Sign in" : "Create account"}
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-sm text-zinc-500">
          {isLogin ? "No account yet?" : "Already have an account?"}{" "}
          <button
            onClick={() => { setIsLogin(!isLogin); setError(""); }}
            className="bg-transparent border-none text-gold cursor-pointer text-sm hover:text-gold-light transition-colors"
          >
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </main>
  );
}