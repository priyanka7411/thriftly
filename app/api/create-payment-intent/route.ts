import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Use service role key for server-side operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { buyer_id, total_amount, shipping_address, payment_method, items } = await req.json();

    // Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        buyer_id: buyer_id || null,
        total_amount,
        shipping_address,
        payment_method,
        payment_status: "paid",
        delivery_status: "processing",
      })
      .select()
      .single();

    if (orderError) {
      console.error("Order error:", orderError);
      return NextResponse.json({ error: orderError.message }, { status: 500 });
    }

    // Create order items
    if (items && items.length > 0) {
      const orderItems = items.map((item: any) => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) {
        console.error("Items error:", itemsError);
      }
    }

    return NextResponse.json({ orderId: order.id, success: true });

  } catch (error: any) {
    console.error("API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}