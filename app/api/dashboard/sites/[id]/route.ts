import { NextResponse } from "next/server";

import withErrorHandler from "@/lib/withErrorHandler";
import updateUserSite from "@/app/api/dashboard/sites/[id]/updateUserSite";
import deleteSite from "@/app/api/dashboard/sites/[id]/deleteSite";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  return withErrorHandler(async () => {
    const body = await request.json();
    const res = await updateUserSite(params.id, body);
    return NextResponse.json(res);
  });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  return withErrorHandler(async () => {
    const res = await deleteSite(params.id);
    return NextResponse.json(res);
  });
}
