import { getServerAuthSession } from "@/app/api/auth/[...nextauth]/route";
import NavBar from "@/components/NavBar";

export default async function Header({ title }: { title?: string }) {
  const session = await getServerAuthSession();
  return <NavBar session={session} title={title} />;
}
