import db from "@/lib/db";
import stripe from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = headers().get("stripe-signature") ?? "";
    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_ENDPOINT_SECRET!
    );

    if (
      ![
        "customer.subscription.deleted",
        "customer.subscription.updated",
        "customer.subscription.created",
      ].includes(event.type)
    ) {
      console.error("Unhandled webhook type", event.type);
      return NextResponse.json(
        { error: true, message: "Unhandled event type" },
        { status: 404 }
      );
    }

    const subscription = event.data.object as Stripe.Subscription;
    const status = subscription?.status;
    switch (event.type) {
      case "customer.subscription.deleted": {
        await db.user.update({
          where: { stripeCustomerId: subscription.customer as string },
          data: { paidPlanEnd: null },
        });
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.created": {
        if (status === "active") {
          const newEndDate = new Date(subscription.current_period_end * 1000);
          await db.user.update({
            where: { stripeCustomerId: subscription.customer as string },
            data: { paidPlanEnd: newEndDate },
          });
        }
        break;
      }
    }

    return NextResponse.json({ error: false });
  } catch (err) {
    console.error("Webhook handling failed", err);
    return NextResponse.json(
      { error: true, message: "There was an error handling the request" },
      { status: 400 }
    );
  }
}
