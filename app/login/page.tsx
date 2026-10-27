import type { Metadata } from "next";
import { LoginForm } from "@/components/app/LoginForm";

export const metadata: Metadata = { title: "Client login" };

export default function LoginPage() {
  return <LoginForm />;
}
