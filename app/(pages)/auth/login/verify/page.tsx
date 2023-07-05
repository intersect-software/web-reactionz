import { getServerAuthSession } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import "../../auth.css";
import VerifyMessage from "@/app/(pages)/auth/login/verify/VerifyMessage";

export default async function Login() {
  const session = await getServerAuthSession();
  if (session) return redirect("/dashboard");

  return <VerifyMessage />;
}
