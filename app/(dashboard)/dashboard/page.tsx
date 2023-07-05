import { getServerAuthSession } from "@/app/api/auth/[...nextauth]/route";
import Sites from "@/app/(dashboard)/dashboard/Sites";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await getServerAuthSession();
  if (!session) return redirect("/");

  return (
    <main>
      <h2>Your Sites</h2>
      <Sites />
    </main>
  );
}
