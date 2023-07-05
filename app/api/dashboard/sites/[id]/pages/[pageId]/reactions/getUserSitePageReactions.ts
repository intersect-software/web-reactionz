import { getServerAuthSession } from "@/app/api/auth/[...nextauth]/route";
import APIError from "@/lib/APIError";
import db from "@/lib/db";
import { getEmoji, getISODateString, sumObjects } from "@/lib/helpers";
import addDays from "date-fns/addDays";
import eachDayOfInterval from "date-fns/eachDayOfInterval";

type CumulativeReactionsByDay = {
  [day: string]: { cumulative?: { [type: string]: number } };
};
type ReactionsByDay = {
  [day: string]: { [type: string]: number };
} & CumulativeReactionsByDay;

export default async function getUserSitePageReactions(
  siteId: string,
  pageId: string,
  dateParams: { from?: string; to?: string; date?: string }
) {
  const session = await getServerAuthSession();
  if (!session) throw new APIError("You are not logged in", 401);
  if (!dateParams.date && (!dateParams.from || !dateParams.to)) {
    throw new APIError("You must provide a date filter", 400);
  }

  const reactions = await db.reaction.findMany({
    where: {
      site_id: siteId,
      page_id: pageId,
      // If one specific date is provided, we can filter at the DB level
      ...(dateParams.date && {
        timestamp: {
          gte: new Date(dateParams.date),
          lt: addDays(new Date(dateParams.date), 1),
        },
      }),
    },
    select: { timestamp: true, page_id: true, type: true },
  });

  const emojis = new Set<string>();
  const reactionsByDay = reactions.reduce((acc, cur) => {
    const day = cur.timestamp.toISOString().split("T")[0];
    if (!acc[day]) acc[day] = {};
    if (!acc[day][cur.type]) acc[day][cur.type] = 0;

    acc[day][cur.type]++;
    emojis.add(cur.type);
    return acc;
  }, {} as ReactionsByDay);

  const uniqueEmojis = Array.from(emojis);
  const emojiCumulativeCounter = Object.fromEntries(
    uniqueEmojis.map((e) => [e, 0])
  );

  // Don't compute cumulative scores if one specific date is provided (makes no sense)
  if (!dateParams.date) {
    Object.keys(reactionsByDay).forEach((day) => {
      reactionsByDay[day].cumulative = sumObjects(
        reactionsByDay[day],
        emojiCumulativeCounter
      );
      Object.assign(emojiCumulativeCounter, reactionsByDay[day].cumulative);
    });
  }

  return {
    error: false,
    reactions:
      // If we have a date range filter, only return those dates
      dateParams.from && dateParams.to
        ? Object.fromEntries(
            eachDayOfInterval({
              start: new Date(dateParams.from),
              end: addDays(new Date(dateParams.to), 1),
            }).map((d) => {
              const date = getISODateString(d);
              const reactions = reactionsByDay[date];
              return reactions ? [date, reactions] : [];
            })
          )
        : reactionsByDay,
    emojis: Object.fromEntries(uniqueEmojis.map((e) => [e, getEmoji(e)])),
  };
}
