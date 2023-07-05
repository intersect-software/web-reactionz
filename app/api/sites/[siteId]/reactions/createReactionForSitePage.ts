import { hash, isDateInFuture } from "@/lib/helpers";
import db from "@/lib/db";
import redis from "@/lib/redis";
import APIError from "@/lib/APIError";

export default async function createReactionForSitePage(
  siteId: string,
  pageId: string,
  reactionType: string,
  ip: string,
  origin: string
) {
  if (!ip || !origin) throw new APIError("Unable to identify requestor", 401);
  if (!pageId) throw new APIError("No page ID provided", 400);
  if (!siteId) throw new APIError("No site ID provided", 400);
  if (!reactionType) throw new APIError("No reaction type provided", 400);

  const userSites = await db.site.findFirst({
    where: { id: siteId },
    include: { user: { include: { sites: true } } },
  });

  if (!userSites?.active) throw new APIError("Invalid site ID provided", 404);

  // If the user is on the free plan and they have multiple sites (e.g., they downgraded)
  //  then only allow reactions to be made on their oldest site
  if (!isDateInFuture(userSites.user.paidPlanEnd)) {
    const requestedSiteId = userSites.id;
    const oldestSite = userSites.user.sites.reduce((prev, cur) =>
      prev.created < cur.created ? prev : cur
    );
    if (requestedSiteId !== oldestSite.id) {
      throw new APIError("Site inactive", 400);
    }
  }

  if (!userSites.emojis.includes(reactionType)) {
    throw new APIError("Invalid emoji", 400);
  }

  const url = new URL(origin);
  if (url.hostname != userSites.hostname) {
    throw new APIError("Host not allowed to react", 401);
  }

  const redisKey = `site_${siteId}:page_${pageId}:ip_${hash(ip)}`;
  const ipCount = await redis.GET(redisKey);

  const {
    max_reactions_per_ip: maxCount,
    max_reactions_per_ip_period_seconds: maxCountPeriodSeconds,
  } = userSites;

  if (!ipCount) {
    await redis.SET(redisKey, 1, { EX: maxCountPeriodSeconds });
  } else if (+ipCount >= maxCount) {
    throw new APIError("Max reaction count exceeded", 400);
  } else {
    await redis.INCR(redisKey);
  }

  await db.reaction.create({
    data: {
      type: reactionType,
      site: { connect: { id: siteId } },
      page_id: pageId,
    },
  });

  return { error: false };
}
