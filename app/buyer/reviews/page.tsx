import Navbar from "@/components/Navbar";
import Link from "next/link";

const sidebarLinks = [
  { icon: "📦", label: "My Orders", href: "/buyer/orders", active: false },
  { icon: "❤️", label: "Wishlist", href: "/buyer/wishlist", active: false },
  { icon: "📍", label: "Addresses", href: "/buyer/addresses", active: false },
  { icon: "💳", label: "Payments", href: "/buyer/payments", active: false },
  { icon: "⭐", label: "My Reviews", href: "/buyer/reviews", active: true },
  { icon: "🔔", label: "Notifications", href: "/buyer/notifications", active: false },
  { icon: "⚙️", label: "Settings", href: "/buyer/settings", active: false },
];

const reviews = [
  { product: "Nike Air Max 90", emoji: "👟", rating: 5, date: "Apr 12, 2025", text: "Excellent condition, exactly as described! Seller shipped fast. Very happy with this purchase.", seller: "sneaker_vault" },
  { product: "Harry Potter Box Set", emoji: "📚", rating: 4, date: "Apr 2, 2025", text: "Great set, all books in good condition. Minor wear on covers but overall worth the price!", seller: "bookworm99" },
];

const pendingReviews = [
  { product: "Banarasi Silk Saree", emoji: "🥻", orderId: "#TH-2025-48291" },
];

export default function Reviews() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-64 shrink-0">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {sidebarLinks.map((item) => (
              <Link href={item.href} key={item.label}>
                <div className={`flex items-center gap-3 px-4 py-3.5 cursor-pointer transition border-l-4 ${item.active ? "bg-emerald-50 border-emerald-500" : "border-transparent hover:bg-gray-50"}`}>
                  <span>{item.icon}</span>
                  <span className={`text-sm font-semibold ${item.active ? "text-emerald-700" : "text-gray-700"}`}>{item.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </aside>
        <div className="flex-1">
          <h1 className="text-2xl font-black text-gray-900 mb-6">My Reviews ⭐</h1>

          {pendingReviews.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-black text-gray-700 mb-3">⏳ Pending Reviews</h2>
              {pendingReviews.map((item) => (
                <div key={item.product} className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl">{item.emoji}</div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900">{item.product}</p>
                    <p className="text-xs text-gray-500">Order {item.orderId} — Delivered</p>
                  </div>
                  <button className="text-xs bg-amber-500 text-white px-4 py-2 rounded-xl font-bold hover:bg-amber-600 transition">Write Review</button>
                </div>
              ))}
            </div>
          )}

          <h2 className="text-sm font-black text-gray-700 mb-3">✅ Submitted Reviews</h2>
          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r.product} className="bg-white rounded-2xl border border-gray-200 p-5">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center text-3xl shrink-0">{r.emoji}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-black text-gray-900">{r.product}</p>
                      <p className="text-xs text-gray-400">{r.date}</p>
                    </div>
                    <p className="text-xs text-gray-400 mb-2">@{r.seller}</p>
                    <div className="flex gap-0.5 mb-2">
                      {Array(5).fill(0).map((_, i) => (
                        <span key={i} className={`text-sm ${i < r.rating ? "text-amber-400" : "text-gray-200"}`}>★</span>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{r.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}