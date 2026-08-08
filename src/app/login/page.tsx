"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FiCode, FiAlertCircle } from "react-icons/fi";
import Button from "@/components/ui/Button";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", { email, password, redirect: false });

    if (res?.error) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }

    const callbackUrl = params.get("callbackUrl");
    router.push(callbackUrl || "/client/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5 bg-bg grid-fade">
      <div className="w-full max-w-sm">
        <Link href="/" className="flex items-center justify-center gap-2 font-display text-xl text-text mb-8">
          <FiCode className="text-violet-bright" />
          Northbeam
        </Link>

        <div className="bg-bg-2 border border-border rounded-xl p-7">
          <h1 className="font-display text-2xl text-text">Welcome back</h1>
          <p className="text-text-dim text-sm mt-1">Log in to your project dashboard.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="font-mono text-[10px] uppercase tracking-wide text-text-dim">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 w-full bg-bg-3 border border-border rounded-lg px-3 py-2.5 text-sm text-text focus:border-violet transition-colors"
              />
            </div>
            <div>
              <label className="font-mono text-[10px] uppercase tracking-wide text-text-dim">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5 w-full bg-bg-3 border border-border rounded-lg px-3 py-2.5 text-sm text-text focus:border-violet transition-colors"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red text-sm">
                <FiAlertCircle size={14} />
                {error}
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <p className="text-center text-sm text-text-dim mt-5">
            No account?{" "}
            <Link href="/register" className="text-violet-bright hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
