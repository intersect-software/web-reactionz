import { getServerAuthSession } from "@/app/api/auth/[...nextauth]/route";
import APIError from "@/lib/APIError";
import db from "@/lib/db";

export default async function deleteUserSitePage(
  siteId: string,
  pageId: string
) {
  const session = await getServerAuthSession();
  if (!session) throw new APIError("You are not logged in", 401);

  const reactions = await db.reaction.findMany({
    where: {
      page_id: pageId,
      site: { user_id: session.user.id, id: siteId },
    },
  });

  if (!reactions?.length) {
    throw new APIError("There are no reactions to delete", 404);
  }

  await db.reaction.deleteMany({
    where: { id: { in: reactions.map((r) => r.id) } },
  });

  return { error: false };
}
