import APIError from "@/lib/APIError";
import db from "@/lib/db";
import redis from "@/lib/redis";
import { getEmoji, hash, isDateInFuture } from "@/lib/helpers";

type Reactions = { [key: string]: { count: number; unicode: string } };

export default async function getWidgetDetails(
  siteId: string | null,
  pageId: string | null,
  ip: string,
  origin: string,
  includeWidgetSettings: boolean
) {
  if (!siteId) throw new APIError("Invalid site ID provided", 400);
  if (!pageId) throw new APIError("Invalid page ID provided", 400);

  const userSites = await db.site.findFirst({
    where: { id: siteId },
    include: { user: { include: { sites: true } } },
  });

  if (!userSites?.active) throw new APIError("Invalid site ID provided", 404);

  const url = new URL(origin);
  if (url.hostname != userSites?.hostname) {
    throw new APIError("Host not allowed to fetch reactions", 401);
  }

  const isPaid = isDateInFuture(userSites.user.paidPlanEnd);

  // If the user is on the free plan and they have multiple sites (e.g., they downgraded)
  //  then only allow reactions to be fetched for their oldest site
  if (!isPaid) {
    const requestedSiteId = userSites.id;
    const oldestSite = userSites.user.sites.reduce((prev, cur) =>
      prev.created < cur.created ? prev : cur
    );
    if (requestedSiteId !== oldestSite.id) {
      throw new APIError("Site inactive", 400);
    }
  }

  const reactions = await db.reaction.groupBy({
    by: ["type"],
    _count: { _all: true },
    where: { site_id: siteId, page_id: pageId },
  });

  const emptyReactionsByType = userSites.emojis.reduce((acc, cur) => {
    acc[cur] = {
      count: 0,
      unicode: getEmoji(cur),
    };
    return acc;
  }, {} as Reactions);

  let reactionsByType = emptyReactionsByType;
  if (userSites.show_reaction_counts) {
    reactionsByType = reactions.reduce((acc, cur) => {
      // Skip reactions that exist but are no longer enabled
      if (!acc[cur.type]) return acc;
      acc[cur.type].count = cur._count._all;
      return acc;
    }, emptyReactionsByType);
  }

  const redisKey = `site_${siteId}:page_${pageId}:ip_${hash(ip)}`;
  const ipCount = await redis.GET(redisKey);

  const ret = {
    reactions: reactionsByType,
    userHasReacted:
      (ipCount && +ipCount === userSites.max_reactions_per_ip) ?? false,
    branding: !isPaid,
  };

  if (includeWidgetSettings) ret.settings = userSites.widget_settings;

  return ret;
}
