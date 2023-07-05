import { getServerAuthSession } from "@/app/api/auth/[...nextauth]/route";
import APIError from "@/lib/APIError";
import db from "@/lib/db";
import { getEmoji } from "@/lib/helpers";
import { DashboardSite, WidgetSettings } from "@/types/apiTypes";

type ReactionsByPage = { [siteId: string]: DashboardSite };

export default async function getUserSites() {
  const session = await getServerAuthSession();
  if (!session) throw new APIError("You are not logged in", 401);

  const sites = await db.site.findMany({
    where: { user_id: session.user.id },
  });

  const pageReactionCounts = await db.reaction.groupBy({
    by: ["type", "page_id", "site_id"],
    _count: { _all: true },
    where: { site: { user_id: session.user.id } },
  });

  let initialSites = sites.reduce((acc, cur) => {
    acc[cur.id] = {
      id: cur.id,
      hostname: cur.hostname,
      active: cur!.active,
      max_reactions_per_ip: cur!.max_reactions_per_ip,
      max_reactions_per_ip_period_seconds:
        cur!.max_reactions_per_ip_period_seconds,
      show_reaction_counts: cur!.show_reaction_counts,
      emojis: cur!.emojis,
      pages: {},
      widget_settings: cur!.widget_settings as WidgetSettings,
    };
    return acc;
  }, {} as ReactionsByPage);

  const pageReactions = pageReactionCounts.reduce((acc, cur) => {
    if (!acc[cur.site_id].pages[cur.page_id]) {
      acc[cur.site_id].pages[cur.page_id] = {};
    }

    // Skip reactions that exist but are no longer enabled
    if (!initialSites[cur.site_id].emojis.includes(cur.type)) return acc;

    const emoji = getEmoji(cur.type);
    if (!acc[cur.site_id].pages[cur.page_id][emoji]) {
      acc[cur.site_id].pages[cur.page_id][emoji] = 0;
    }

    acc[cur.site_id].pages[cur.page_id][emoji] = cur._count._all;
    return acc;
  }, initialSites as unknown as ReactionsByPage);

  return {
    error: false,
    sites: Object.values(pageReactions),
  };
}
