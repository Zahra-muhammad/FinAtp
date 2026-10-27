"use client";

// One-click demo sign-in for presenting: /demo/client, /demo/new, /demo/staff.
// Add ?reset=1 to restore the seed data first.

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { demoAccounts } from "@/data/seed";
import { signInWith, startDemoSync, useDemo } from "@/lib/demo/store";

const map: Record<string, number> = { client: 0, rania: 0, new: 1, omar: 1, staff: 2, admin: 2 };

function DemoSignIn() {
  const { who } = useParams<{ who: string }>();
  const search = useSearchParams();
  const router = useRouter();
  useEffect(() => {
    startDemoSync(() => {
      if (search.get("reset") === "1") useDemo.getState().reset();
      const acc = demoAccounts[map[who] ?? 0];
      const user = signInWith(acc.email, acc.password);
      router.replace(user?.role === "staff" ? "/admin" : "/portal");
    });
  }, [who, search, router]);
  return <p className="grid min-h-dvh place-items-center text-muted">Signing in…</p>;
}

export default function Page() {
  return (
    <Suspense>
      <DemoSignIn />
    </Suspense>
  );
}
