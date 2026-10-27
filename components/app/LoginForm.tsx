"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useState } from "react";
import { EXPO, Lines } from "@/components/motion/primitives";
import { Arrow, Label, Logo } from "@/components/ui/bits";
import { Panel } from "@/components/visual/Panel";
import { useDemoReady } from "@/lib/demo/hooks";
import { signInWith } from "@/lib/demo/store";

export function LoginForm() {
  const router = useRouter();
  const ready = useDemoReady();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  function go() {
    const user = signInWith(email, password);
    if (!user) {
      setError("That email and password don't match an account.");
      return;
    }
    router.push(user.role === "staff" ? "/admin" : "/portal");
  }

  return (
    <main id="main" className="grid min-h-dvh lg:grid-cols-2">
      {/* Left: brand */}
      <section className="on-ink relative flex flex-col overflow-hidden bg-ink p-6 text-paper md:p-12">
        <Panel variant="arcs" className="absolute inset-0 opacity-70" />
        <div className="relative flex items-center justify-between">
          <Link href="/" aria-label="FinApt Group — home">
            <Logo tone="white" className="h-10 w-auto md:h-11" />
          </Link>
          <Link href="/" className="text-sm text-mist-2 link-draw">
            ← Back to site
          </Link>
        </div>
        <div className="relative mt-16 lg:mt-auto">
          <Label className="text-mist">Client portal</Label>
          <Lines as="h1" trigger="mount" className="t-h1 mt-5">
            <span>Your firm,</span>
            <span className="t-serif text-blue-tint">in one place.</span>
          </Lines>
          <ul className="mt-10 grid gap-3">
            {[
              ["Live progress", "See every engagement move stage by stage, as your Partner updates it."],
              ["Documents", "Upload what we ask for and collect deliverables in one secure place."],
              ["Invoices & messages", "Pay, download and talk to your team without the email chains."],
            ].map(([t, d], i) => (
              <motion.li
                key={t}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: EXPO, delay: 0.3 + i * 0.08 }}
                className="rounded-xl border border-ink-line bg-ink-2/80 p-4 backdrop-blur"
              >
                <span className="t-label block text-blue-tint">{t}</span>
                <span className="mt-1 block text-sm text-mist">{d}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* Right: form */}
      <section className="flex items-center bg-paper p-6 md:p-12">
        <div className="mx-auto w-full max-w-md">
          <h2 className="t-h2">Sign in</h2>
          <p className="mt-3 text-muted-2">Clients and FinApt staff use the same sign-in.</p>
          <form
            className="mt-10 space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              go();
            }}
          >
            <div>
              <label htmlFor="email" className="field-label">Email</label>
              <input id="email" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} className="field" />
            </div>
            <div>
              <label htmlFor="password" className="field-label">Password</label>
              <input id="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="field" />
            </div>
            {error ? (
              <p role="alert" className="text-sm text-signal-text">
                {error}
              </p>
            ) : null}
            <button type="submit" className="btn btn-ink w-full" disabled={!ready}>
              Sign in <Arrow />
            </button>
          </form>
          <p className="mt-8 text-sm text-muted">
            New to FinApt?{" "}
            <Link href="/start" className="font-medium text-blue link-draw">
              Start with FinApt
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
