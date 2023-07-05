import { getServerAuthSession } from "@/app/api/auth/[...nextauth]/route";
import APIError from "@/lib/APIError";
import { DEFAULT_WIDGET_SETTINGS } from "@/lib/constants";
import db from "@/lib/db";

export default async function createNewSite(body: any) {
  const session = await getServerAuthSession();
  if (!session) throw new APIError("You are not logged in", 401);

  const user = await db.user.findFirst({
    where: { id: session.user.id },
    select: { paidPlanEnd: true, sites: { select: { _count: true } } },
  });

  const isPaidPlanActive = user?.paidPlanEnd && user?.paidPlanEnd > new Date();
  if (
    !isPaidPlanActive &&
    user!.sites._count > +process.env.MAX_SITES_FREE_PLAN!
  ) {
    throw new APIError(
      "You have reached the maximum number of sites for your account. Please upgrade your account or delete an existing site",
      400
    );
  }

  if (await db.site.count({ where: { hostname: body.hostname } })) {
    throw new APIError("The provided hostname is already in use.", 400);
  }

  const site = await db.site.create({
    data: {
      hostname: body.hostname,
      user: { connect: { id: session.user!.id } },
      widget_settings: DEFAULT_WIDGET_SETTINGS,
    },
  });

  return { error: false, site_id: site.id };
}
