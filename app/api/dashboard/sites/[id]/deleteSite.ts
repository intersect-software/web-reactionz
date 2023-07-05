import { getServerAuthSession } from "@/app/api/auth/[...nextauth]/route";
import APIError from "@/lib/APIError";
import db from "@/lib/db";

export default async function deleteSite(siteId: string) {
  const session = await getServerAuthSession();
  if (!session) throw new APIError("You are not logged in", 401);

  const userSite = await db.site.findFirst({
    where: { id: siteId, user_id: session.user.id },
  });

  if (!userSite) {
    throw new APIError("You do not have permission to delete this site", 403);
  }

  await db.site.delete({ where: { id: siteId } });
  return { error: false };
}
