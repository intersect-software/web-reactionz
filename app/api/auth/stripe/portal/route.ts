import { getServerAuthSession } from "@/app/api/auth/[...nextauth]/route";
import db from "@/lib/db";
import stripe from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await getServerAuthSession();
  if (!session) return NextResponse.redirect("/");

  const user = await db.user.findFirst({
    where: { id: session.user.id },
    select: { stripeCustomerId: true },
  });
  if (!user?.stripeCustomerId) return NextResponse.redirect("/");

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: process.env.BASE_URL,
  });

  if (!portalSession.url) return NextResponse.redirect("/");
  return NextResponse.redirect(portalSession.url);
}
