import { NextResponse } from "next/server";

import withErrorHandler from "@/lib/withErrorHandler";
import getUserSites from "./getUserSites";
import createNewSite from "./createNewSite";

export async function GET(request: Request) {
  return withErrorHandler(async () => {
    const res = await getUserSites();
    return NextResponse.json(res);
  });
}

export async function POST(request: Request) {
  return withErrorHandler(async () => {
    const res = await createNewSite(await request.json());
    return NextResponse.json(res);
  });
}
