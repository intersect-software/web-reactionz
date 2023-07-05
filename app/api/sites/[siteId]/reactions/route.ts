import { NextResponse } from "next/server";

import withErrorHandler from "@/lib/withErrorHandler";
import createReactionForSitePage from "./createReactionForSitePage";

export async function POST(
  request: Request,
  { params }: { params: { siteId: string } }
) {
  return withErrorHandler(async () => {
    const body = await request.json();
    const { page_id: pageId, type: reactionType } = body;
    const ip = request.headers.get("x-forwarded-host")!;
    const origin =
      request.headers.get("origin") ?? request.headers.get("referer")!;
    const res = await createReactionForSitePage(
      params.siteId,
      pageId,
      reactionType,
      ip,
      origin
    );

    return NextResponse.json(res);
  });
}

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    }
  );
}
