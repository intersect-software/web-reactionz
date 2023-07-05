import { getServerAuthSession } from "@/app/api/auth/[...nextauth]/route";
import "./index.css";
import Landing from "@/app/Landing";

export default async function Home() {
  const session = await getServerAuthSession();
  return <Landing isLoggedIn={!!session} />;
}
