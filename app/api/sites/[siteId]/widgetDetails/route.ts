import { NextResponse } from "next/server";

import withErrorHandler from "@/lib/withErrorHandler";
import getWidgetDetails from "@/app/api/sites/[siteId]/widgetDetails/getWidgetDetails";

export async function GET(
  request: Request,
  { params }: { params: { siteId: string } }
) {
  return withErrorHandler(async () => {
    const { searchParams } = new URL(request.url);
    const ip = request.headers.get("x-forwarded-host")!;
    const origin =
      request.headers.get("origin") ?? request.headers.get("referer")!;
    const res = await getWidgetDetails(
      params.siteId,
      searchParams.get("page_id"),
      ip,
      origin,
      !!searchParams.get("settings")
    );

    return NextResponse.json(res);
  });
}
