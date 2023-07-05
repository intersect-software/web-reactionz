import { NextResponse } from "next/server";

import withErrorHandler from "@/lib/withErrorHandler";
import getUserSitePageReactions from "@/app/api/dashboard/sites/[id]/pages/[pageId]/reactions/getUserSitePageReactions";
import deleteUserSitePage from "@/app/api/dashboard/sites/[id]/pages/[pageId]/reactions/deleteUserSitePage";

export async function GET(
  request: Request,
  { params }: { params: { id: string; pageId: string } }
) {
  return withErrorHandler(async () => {
    const url = new URL(request.url);
    const res = await getUserSitePageReactions(
      params.id,
      params.pageId,
      Object.fromEntries(url.searchParams)
    );
    return NextResponse.json(res);
  });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; pageId: string } }
) {
  return withErrorHandler(async () => {
    const res = await deleteUserSitePage(params.id, params.pageId);
    return NextResponse.json(res);
  });
}
