import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { to, subject, orderId, total, items, name } = await req.json();

    const itemsHTML = items?.map((item: any) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #f0f0f0;">
          <strong>${item.name}</strong><br/>
          <span style="color: #666; font-size: 12px;">Qty: ${item.quantity}</span>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #f0f0f0; text-align: right; color: #059669; font-weight: bold;">
          ₹${(item.price * item.quantity).toLocaleString()}
        </td>
      </tr>
    `).join("") || "";

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
      </head>
      <body style="margin: 0; padding: 0; background-color: #f8f6f3; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
        
        <div style="max-width: 600px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06);">
          
          <!-- Header -->
          <div style="background: #059669; padding: 32px 40px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -0.5px;">
              T Thriftly
            </h1>
            <p style="color: #a7f3d0; margin: 8px 0 0; font-size: 14px;">
              Sustainable Shopping — India & Beyond 🌿
            </p>
          </div>

          <!-- Success Banner -->
          <div style="background: #ecfdf5; border-bottom: 2px solid #059669; padding: 24px 40px; text-align: center;">
            <div style="font-size: 48px; margin-bottom: 8px;">🎉</div>
            <h2 style="color: #059669; margin: 0; font-size: 24px; font-weight: 900;">Order Placed Successfully!</h2>
            <p style="color: #065f46; margin: 8px 0 0; font-size: 14px;">
              Hi ${name || "there"}, your order has been confirmed!
            </p>
          </div>

          <!-- Order Details -->
          <div style="padding: 32px 40px;">
            
            <div style="background: #f8f6f3; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 6px 0; color: #666; font-size: 13px;">Order ID</td>
                  <td style="padding: 6px 0; text-align: right; font-weight: 700; color: #111;">#TH-${orderId}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #666; font-size: 13px;">Date</td>
                  <td style="padding: 6px 0; text-align: right; font-weight: 700; color: #111;">${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #666; font-size: 13px;">Status</td>
                  <td style="padding: 6px 0; text-align: right;">
                    <span style="background: #dbeafe; color: #1d4ed8; padding: 2px 10px; border-radius: 20px; font-size: 12px; font-weight: 700;">Processing</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #666; font-size: 13px;">Delivery</td>
                  <td style="padding: 6px 0; text-align: right; font-weight: 700; color: #111;">Standard — 5 to 7 days</td>
                </tr>
              </table>
            </div>

            <!-- Items -->
            <h3 style="margin: 0 0 12px; font-size: 16px; font-weight: 900; color: #111;">Items Ordered</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
              ${itemsHTML}
            </table>

            <!-- Total -->
            <div style="background: #059669; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px;">
              <p style="color: #a7f3d0; margin: 0 0 4px; font-size: 13px;">Total Paid</p>
              <p style="color: white; margin: 0; font-size: 32px; font-weight: 900;">₹${Number(total).toLocaleString()}</p>
              <p style="color: #a7f3d0; margin: 8px 0 0; font-size: 12px;">Payment secured by Stripe 🔒</p>
            </div>

            <!-- What happens next -->
            <h3 style="margin: 0 0 16px; font-size: 16px; font-weight: 900; color: #111;">What happens next?</h3>
            <div style="space-y: 12px;">
              ${[
                { icon: "✅", title: "Order Confirmed", desc: "Your order has been placed", done: true },
                { icon: "📦", title: "Seller Preparing", desc: "Seller is packing your items", done: false },
                { icon: "🚚", title: "Out for Shipping", desc: "Your order is on its way", done: false },
                { icon: "🏠", title: "Delivered", desc: "Expected in 5–7 business days", done: false },
              ].map(step => `
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px; padding: 12px; background: ${step.done ? "#ecfdf5" : "#f9f9f9"}; border-radius: 10px; border: 1px solid ${step.done ? "#a7f3d0" : "#e5e5e5"};">
                  <span style="font-size: 20px;">${step.icon}</span>
                  <div>
                    <p style="margin: 0; font-weight: 700; font-size: 13px; color: ${step.done ? "#059669" : "#666"};">${step.title}</p>
                    <p style="margin: 2px 0 0; font-size: 12px; color: #999;">${step.desc}</p>
                  </div>
                  ${step.done ? '<span style="margin-left: auto; color: #059669; font-size: 12px; font-weight: 700;">Done ✓</span>' : ""}
                </div>
              `).join("")}
            </div>

            <!-- CTA Button -->
            <div style="text-align: center; margin-top: 32px;">
              <a href="https://thriftly-murex.vercel.app/buyer/orders" 
                 style="display: inline-block; background: #059669; color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 900; font-size: 14px;">
                📦 Track My Order
              </a>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #f8f6f3; padding: 24px 40px; text-align: center; border-top: 1px solid #e5e5e5;">
            <p style="margin: 0; color: #999; font-size: 12px;">
              Need help? Reply to this email or visit our 
              <a href="https://thriftly-murex.vercel.app/how-it-works" style="color: #059669;">Help Center</a>
            </p>
            <p style="margin: 8px 0 0; color: #ccc; font-size: 11px;">
              © 2026 Thriftly. Made with ❤️ in India 🇮🇳 for the World 🌍
            </p>
          </div>
        </div>

      </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: "Thriftly <onboarding@resend.dev>",
      to: [to],
      subject: subject || `Order Confirmed! #TH-${orderId} 🎉`,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data?.id });

  } catch (error: any) {
    console.error("Email error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}