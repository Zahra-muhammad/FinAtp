import type { Metadata } from "next";
import { Suspense } from "react";
import { Onboarding } from "@/components/app/Onboarding";

export const metadata: Metadata = { title: "Start with FinApt" };

export default function StartPage() {
  return (
    <Suspense>
      <Onboarding />
    </Suspense>
  );
}
