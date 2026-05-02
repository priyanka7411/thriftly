"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const total = searchParams.get("total");
  const email = searchParams.get("email");

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white text-sm font-black">T</div>
            <span className="text-xl font-black text-gray-900">Thriftly</span>
          </Link>
          <span className="text-xs text-emerald-600 font-semibold">🔒 Secure Checkout</span>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-16 text-center">

        {/* Success */}
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 border-4 border-emerald-200">
          ✅
        </div>

        <h1 className="text-3xl font-black text-gray-900 mb-2">Order Placed! 🎉</h1>
        <p className="text-gray-500 text-sm mb-2">Thank you! We've sent a confirmation to</p>
        <p className="text-emerald-700 font-bold text-sm mb-8">{email || "your email"}</p>

        {/* Order Details */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-6 text-left">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-black text-gray-900">Order Details</h2>
            <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full font-bold">Confirmed ✓</span>
          </div>
          <div className="space-y-2.5">
            {[
              ["Order ID", `#TH-${orderId || "000000"}`],
              ["Date", new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })],
              ["Total Paid", `₹${Number(total || 0).toLocaleString()}`],
              ["Delivery", "Standard — 5 to 7 business days"],
              ["Status", "Processing"],
            ].map(([key, val]) => (
              <div key={key} className="flex justify-between">
                <span className="text-xs text-gray-400 font-medium">{key}</span>
                <span className="text-xs text-gray-800 font-semibold">{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* What happens next */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-8 text-left">
          <h2 className="text-sm font-black text-gray-900 mb-5">What happens next?</h2>
          <div className="space-y-4">
            {[
              { icon: "✅", label: "Order Confirmed", desc: "Your order has been placed successfully", done: true },
              { icon: "📦", label: "Seller Preparing", desc: "Seller is packing your items", done: false },
              { icon: "🚚", label: "Out for Shipping", desc: "Your order is on its way", done: false },
              { icon: "🏠", label: "Delivered", desc: "Expected in 5–7 business days", done: false },
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 ${step.done ? "bg-emerald-100 border-2 border-emerald-400" : "bg-gray-100 border-2 border-gray-200"}`}>
                  {step.icon}
                </div>
                <div className="flex-1 pt-0.5">
                  <p className={`text-sm font-bold ${step.done ? "text-emerald-700" : "text-gray-400"}`}>{step.label}</p>
                  <p className="text-xs text-gray-400">{step.desc}</p>
                </div>
                {step.done && <span className="text-xs text-emerald-600 font-bold shrink-0">Done ✓</span>}
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-3">
          <Link href="/buyer/orders">
            <button className="w-full bg-emerald-600 text-white py-3.5 rounded-2xl text-sm font-black hover:bg-emerald-700 transition">
              📦 Track My Order
            </button>
          </Link>
          <Link href="/browse">
            <button className="w-full border-2 border-gray-200 text-gray-700 py-3.5 rounded-2xl text-sm font-bold hover:border-emerald-300 transition">
              🛍️ Continue Shopping
            </button>
          </Link>
        </div>

        <p className="text-xs text-gray-400 mt-8">
          Need help? <Link href="/how-it-works" className="text-emerald-600 font-semibold hover:underline">Contact Support</Link>
        </p>
      </div>
    </div>
  );
}

export default function OrderConfirmation() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-bounce">✅</div>
          <p className="text-gray-500">Loading your order...</p>
        </div>
      </div>
    }>
      <OrderConfirmationContent />
    </Suspense>
  );
}