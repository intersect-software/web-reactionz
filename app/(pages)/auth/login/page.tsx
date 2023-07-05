import LoginForm from "@/app/(pages)/auth/login/LoginForm";
import { getServerAuthSession } from "@/app/api/auth/[...nextauth]/route";
import { getCsrfToken } from "next-auth/react";
import { redirect } from "next/navigation";
import "../auth.css";
import ErrorMessage from "@/components/ErrorMessage";

export default async function Login({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const session = await getServerAuthSession();
  if (session) return redirect("/dashboard");

  const csrfToken = await getCsrfToken();

  return searchParams.error ? (
    <ErrorMessage message="logging in" className="container" />
  ) : (
    <LoginForm csrfToken={csrfToken} />
  );
}
