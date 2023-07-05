import { getServerAuthSession } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import "../auth.css";
import LogoutMessage from "@/app/(pages)/auth/logout/LogoutMessage";

export default async function Logout() {
  const session = await getServerAuthSession();
  if (!session) return redirect("/");

  return <LogoutMessage />;
}
