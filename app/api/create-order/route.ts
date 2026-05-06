import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log("Received body:", body);

    const {
      buyer_id,
      total_amount,
      shipping_address,
      payment_method,
      items,
    } = body;

    const parsedTotal = Number(total_amount);

    if (
      typeof parsedTotal !== "number" ||
      isNaN(parsedTotal) ||
      parsedTotal <= 0
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

    // CREATE ORDER
    const { data: order, error: orderError } =
      await supabase
        .from("orders")
        .insert({
          buyer_id: buyer_id || null,
          total_amount: parsedTotal,
          shipping_address:
            shipping_address || "Not provided",
          payment_method:
            payment_method || "stripe",
          payment_status: "paid",
          delivery_status: "processing",
        })
        .select()
        .single();

    if (orderError) {
      console.error(orderError);

      return NextResponse.json(
        {
          error: orderError.message,
        },
        {
          status: 500,
        }
      );
    }

    // INSERT ORDER ITEMS
    if (
      items &&
      Array.isArray(items) &&
      items.length > 0
    ) {
      const orderItems = items.map(
        (item: any) => ({
          order_id: order.id,
          product_id:
            item.id?.toString() || null,
          quantity:
            Number(item.quantity) || 1,
          price:
            Number(item.price) || 0,
        })
      );

      const { error: itemsError } =
        await supabase
          .from("order_items")
          .insert(orderItems);

      if (itemsError) {
        console.error(itemsError);

        return NextResponse.json(
          {
            error: itemsError.message,
          },
          {
            status: 500,
          }
        );
      }
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
    });

  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          error.message ||
          "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}