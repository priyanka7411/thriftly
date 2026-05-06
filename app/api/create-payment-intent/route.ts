import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY!,
  {
    apiVersion: "2026-04-22.dahlia",
  }
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log("Received Body:", body);

    const amount = Number(body.amount);

    console.log("Parsed Amount:", amount);

    // SAFE VALIDATION
    if (
      typeof amount !== "number" ||
      isNaN(amount) ||
      amount <= 0
    ) {
      return NextResponse.json(
        {
          error: "Invalid total amount",
        },
        {
          status: 400,
        }
      );
    }

    // STRIPE PAYMENT INTENT
    const paymentIntent =
      await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: "inr",

        automatic_payment_methods: {
          enabled: true,
        },
      });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });

  } catch (error: any) {
    console.error("Stripe Error:", error);

    return NextResponse.json(
      {
        error:
          error.message ||
          "Payment Intent Failed",
      },
      {
        status: 500,
      }
    );
  }
}