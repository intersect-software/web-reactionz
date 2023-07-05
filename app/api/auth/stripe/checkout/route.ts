import { getServerAuthSession } from "@/app/api/auth/[...nextauth]/route";
import db from "@/lib/db";
import { isDateInFuture } from "@/lib/helpers";
import stripe from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await getServerAuthSession();
  if (!session) {
    return NextResponse.redirect(
      "/auth/login?callbackUrl=" +
        encodeURIComponent(`${process.env.BASE_URL}/auth/stripe/checkout`)
    );
  }

  const user = await db.user.findFirst({ where: { id: session.user.id } });
  let stripeCustomerId = user!.stripeCustomerId;

  // If the customer has already used Stripe before and has an existing paid plan, send them to their portal
  if (stripeCustomerId && isDateInFuture(user!.paidPlanEnd)) {
    return NextResponse.redirect(
      `${process.env.BASE_URL}/api/auth/stripe/portal`
    );
  }

  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({ email: user!.email });
    stripeCustomerId = customer.id;
    await db.user.update({
      where: { id: user!.id },
      data: { stripeCustomerId },
    });
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    billing_address_collection: "auto",
    line_items: [{ price: process.env.STRIPE_MONTHLY_PRODUCT_ID, quantity: 1 }],
    customer: stripeCustomerId,
    allow_promotion_codes: true,
    payment_method_collection: "if_required",
    mode: "subscription",
    success_url: `${process.env.BASE_URL}/dashboard`,
    cancel_url: process.env.BASE_URL,
  });

  if (!checkoutSession.url) return NextResponse.redirect("/");
  return NextResponse.redirect(checkoutSession.url);
}
