"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiCode, FiAlertCircle } from "react-icons/fi";
import Button from "@/components/ui/Button";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, company }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setLoading(false);
        return;
      }

      const signInRes = await signIn("credentials", { email, password, redirect: false });
      if (signInRes?.error) {
        setError("Account created — please log in.");
        router.push("/login");
        return;
      }

      // If they arrived here mid-inquiry, submit it now that they're authenticated.
      const pending = sessionStorage.getItem("pendingInquiry");
      if (pending) {
        sessionStorage.removeItem("pendingInquiry");
        const inquiryRes = await fetch("/api/inquiries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(JSON.parse(pending)),
        });
        const inquiryData = await inquiryRes.json();
        if (inquiryRes.ok) {
          router.push(`/client/projects/${inquiryData.id}`);
          router.refresh();
          return;
        }
      }

      router.push("/client/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-12 bg-bg grid-fade">
      <div className="w-full max-w-sm">
        <Link href="/" className="flex items-center justify-center gap-2 font-display text-xl text-text mb-8">
          <FiCode className="text-violet-bright" />
          Pinex
        </Link>

        <div className="bg-bg-2 border border-border rounded-xl p-7">
          <h1 className="font-display text-2xl text-text">Create your account</h1>
          <p className="text-text-dim text-sm mt-1">Submit a project and track it in one place.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="font-mono text-[10px] uppercase tracking-wide text-text-dim">Name</label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1.5 w-full bg-bg-3 border border-border rounded-lg px-3 py-2.5 text-sm text-text focus:border-violet transition-colors"
              />
            </div>
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
              <label className="font-mono text-[10px] uppercase tracking-wide text-text-dim">Company (optional)</label>
              <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="mt-1.5 w-full bg-bg-3 border border-border rounded-lg px-3 py-2.5 text-sm text-text focus:border-violet transition-colors"
              />
            </div>
            <div>
              <label className="font-mono text-[10px] uppercase tracking-wide text-text-dim">Password</label>
              <input
                type="password"
                required
                minLength={8}
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
              {loading ? "Creating account…" : "Create account"}
            </Button>
          </form>

          <p className="text-center text-sm text-text-dim mt-5">
            Already have an account?{" "}
            <Link href="/login" className="text-violet-bright hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
