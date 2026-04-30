import Navbar from "@/components/Navbar";
import Link from "next/link";

const orders = [
  { id: "#TH-2025-48291", date: "Apr 26, 2025", items: 3, total: "₹5,250", status: "Processing", emoji: "🥻", products: ["Banarasi Silk Saree", "Nike Air Max 90", "Harry Potter Box Set"] },
  { id: "#TH-2025-41823", date: "Apr 10, 2025", items: 1, total: "₹3,500", status: "Delivered", emoji: "👟", products: ["Nike Air Max 90"] },
  { id: "#TH-2025-39012", date: "Mar 28, 2025", items: 2, total: "₹2,100", status: "Delivered", emoji: "📚", products: ["Harry Potter Box Set", "Kurta Set XL"] },
  { id: "#TH-2025-31456", date: "Mar 12, 2025", items: 1, total: "₹899", status: "Cancelled", emoji: "🧥", products: ["Vintage Denim Jacket"] },
];

const statusStyle: Record<string, string> = {
  Processing: "bg-blue-50 text-blue-700 border border-blue-200",
  Delivered: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Cancelled: "bg-red-50 text-red-600 border border-red-200",
  Shipped: "bg-orange-50 text-orange-700 border border-orange-200",
};

const sidebarLinks = [
  { icon: "📦", label: "My Orders", href: "/buyer/orders", active: true },
  { icon: "❤️", label: "Wishlist", href: "/buyer/wishlist", active: false },
  { icon: "📍", label: "Addresses", href: "/buyer/addresses", active: false },
  { icon: "💳", label: "Payments", href: "/buyer/payments", active: false },
  { icon: "⭐", label: "My Reviews", href: "/buyer/reviews", active: false },
  { icon: "🔔", label: "Notifications", href: "/buyer/notifications", active: false },
  { icon: "⚙️", label: "Settings", href: "/buyer/settings", active: false },
];

export default function BuyerOrders() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-4 text-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center text-2xl font-black mx-auto mb-3">P</div>
              <p className="text-base font-black text-gray-900">Priyanka Malavade</p>
              <p className="text-xs text-gray-400 mt-0.5">priyasmalavade@gmail.com</p>
              <div className="mt-3 flex items-center justify-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                <span className="text-xs text-emerald-700 font-semibold">Verified Buyer</span>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              {sidebarLinks.map((item) => (
                <Link href={item.href} key={item.label}>
                  <div className={`flex items-center gap-3 px-4 py-3.5 cursor-pointer transition border-l-4 ${item.active ? "bg-emerald-50 border-emerald-500" : "border-transparent hover:bg-gray-50"}`}>
                    <span>{item.icon}</span>
                    <span className={`text-sm font-semibold ${item.active ? "text-emerald-700" : "text-gray-700"}`}>{item.label}</span>
                    {item.active && <span className="ml-auto text-emerald-500 text-xs">→</span>}
                  </div>
                </Link>
              ))}
              <div className="border-t border-gray-100">
                <div className="flex items-center gap-3 px-4 py-3.5 cursor-pointer hover:bg-red-50">
                  <span>🚪</span>
                  <span className="text-sm font-semibold text-red-500">Logout</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-black text-gray-900">My Orders 📦</h1>
              <div className="flex gap-2">
                {["All", "Processing", "Delivered", "Cancelled"].map((f, i) => (
                  <button key={f} className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition ${i === 0 ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-gray-600 border-gray-200 hover:border-emerald-400"}`}>{f}</button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-emerald-200 transition">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-xl">{order.emoji}</div>
                      <div>
                        <p className="text-sm font-black text-gray-900">{order.id}</p>
                        <p className="text-xs text-gray-400">{order.date} · {order.items} item{order.items > 1 ? "s" : ""}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyle[order.status]}`}>{order.status}</span>
                      <p className="text-sm font-black text-gray-900">{order.total}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {order.products.map(p => (
                      <span key={p} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{p}</span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                    <button className="text-xs bg-emerald-600 text-white px-4 py-1.5 rounded-lg font-bold hover:bg-emerald-700 transition">Track Order</button>
                    <button className="text-xs border border-gray-200 text-gray-600 px-4 py-1.5 rounded-lg font-bold hover:border-emerald-400 transition">View Details</button>
                    {order.status === "Delivered" && (
                      <button className="text-xs border border-amber-200 text-amber-600 px-4 py-1.5 rounded-lg font-bold hover:bg-amber-50 transition">⭐ Write Review</button>
                    )}
                    {order.status === "Cancelled" && (
                      <button className="text-xs border border-red-200 text-red-500 px-4 py-1.5 rounded-lg font-bold hover:bg-red-50 transition">Reorder</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}