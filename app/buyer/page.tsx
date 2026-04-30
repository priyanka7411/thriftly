import Navbar from "@/components/Navbar";
import Link from "next/link";

const orders = [
  { id: "#TH-2025-48291", date: "Apr 26, 2025", items: 3, total: "₹5,250", status: "Processing", emoji: "🥻" },
  { id: "#TH-2025-41823", date: "Apr 10, 2025", items: 1, total: "₹3,500", status: "Delivered", emoji: "👟" },
  { id: "#TH-2025-39012", date: "Mar 28, 2025", items: 2, total: "₹2,100", status: "Delivered", emoji: "📚" },
  { id: "#TH-2025-31456", date: "Mar 12, 2025", items: 1, total: "₹899", status: "Cancelled", emoji: "🧥" },
];

const wishlist = [
  { name: "Canon DSLR 1300D", price: "₹18,000", original: "₹45,000", emoji: "📷", seller: "gear_resell", tag: "60% off" },
  { name: "PS4 Controller", price: "₹1,800", original: "₹4,500", emoji: "🎮", seller: "gamer_hub", tag: "60% off" },
  { name: "Leather Tote Bag", price: "₹1,100", original: "₹3,500", emoji: "👜", seller: "baghouse", tag: "68% off" },
];

const statusStyle: Record<string, string> = {
  "Processing": "bg-blue-50 text-blue-700 border border-blue-200",
  "Delivered": "bg-emerald-50 text-emerald-700 border border-emerald-200",
  "Cancelled": "bg-red-50 text-red-600 border border-red-200",
  "Shipped": "bg-orange-50 text-orange-700 border border-orange-200",
};

export default function BuyerDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* ✅ Navbar added properly */}
      <Navbar />

      {/* ✅ Main Content Wrapper (important fix for spacing) */}
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-gray-900">My Account 👤</h1>
            <p className="text-sm text-gray-400 mt-0.5">Welcome back, Priyanka! 👋</p>
          </div>
          <Link href="/browse">
            <button className="px-5 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 transition">
              🛍️ Continue Shopping
            </button>
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar */}
          <aside className="w-full lg:w-64 shrink-0">

            <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-4 text-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center text-2xl font-black mx-auto mb-3">P</div>
              <p className="text-base font-black text-gray-900">Priyanka Malavade</p>
              <p className="text-xs text-gray-400 mt-0.5">priyasmalavade@gmail.com</p>
              <p className="text-xs text-gray-400">🇮🇳 Karnataka, India</p>
              <div className="mt-3 flex items-center justify-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                <span className="text-xs text-emerald-700 font-semibold">Verified Buyer</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              {[
                { icon: "📦", label: "My Orders", active: true, href: "/buyer" },
                { icon: "❤️", label: "Wishlist", active: false, href: "/buyer/wishlist" },
                { icon: "📍", label: "Addresses", active: false, href: "/buyer/addresses" },
                { icon: "💳", label: "Payments", active: false, href: "/buyer/payments" },
                { icon: "⭐", label: "My Reviews", active: false, href: "/buyer/reviews" },
                { icon: "🔔", label: "Notifications", active: false, href: "/buyer/notifications" },
                { icon: "⚙️", label: "Settings", active: false, href: "/buyer/settings" },
              ].map((item) => (
                <Link href={item.href} key={item.label}>
                  <div className={`flex items-center gap-3 px-4 py-3.5 cursor-pointer transition border-l-4 ${item.active ? "bg-emerald-50 border-emerald-500 text-emerald-700" : "border-transparent hover:bg-gray-50 text-gray-600"}`}>
                    <span>{item.icon}</span>
                    <span className="text-sm font-semibold">{item.label}</span>
                    {item.active && <span className="ml-auto text-emerald-500 text-xs">→</span>}
                  </div>
                </Link>
              ))}

              <div className="border-t border-gray-100">
                <div className="flex items-center gap-3 px-4 py-3.5 cursor-pointer hover:bg-red-50 transition">
                  <span>🚪</span>
                  <span className="text-sm font-semibold text-red-500">Logout</span>
                </div>
              </div>
            </div>

          </aside>

          {/* Main Content */}
          <div className="flex-1 space-y-6">

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: "📦", label: "Total Orders", value: "4", color: "bg-blue-50 text-blue-600" },
                { icon: "✅", label: "Delivered", value: "2", color: "bg-emerald-50 text-emerald-600" },
                { icon: "⏳", label: "Processing", value: "1", color: "bg-orange-50 text-orange-600" },
                { icon: "💸", label: "Total Spent", value: "₹11,749", color: "bg-purple-50 text-purple-600" },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-2xl border border-gray-200 p-4">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg mb-3 ${stat.color}`}>{stat.icon}</div>
                  <p className="text-xl font-black text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Orders */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between">
                <h2 className="text-base font-black">My Orders</h2>
              </div>

              <div className="divide-y">
                {orders.map((order) => (
                  <div key={order.id} className="flex items-center gap-4 px-6 py-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-2xl">{order.emoji}</div>
                    <div className="flex-1">
                      <p className="font-bold">{order.id}</p>
                      <p className="text-xs text-gray-400">{order.date}</p>
                    </div>
                    <p className="font-bold">{order.total}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}