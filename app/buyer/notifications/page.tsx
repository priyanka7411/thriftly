import Navbar from "@/components/Navbar";
import Link from "next/link";

const sidebarLinks = [
  { icon: "📦", label: "My Orders", href: "/buyer/orders", active: false },
  { icon: "❤️", label: "Wishlist", href: "/buyer/wishlist", active: false },
  { icon: "📍", label: "Addresses", href: "/buyer/addresses", active: false },
  { icon: "💳", label: "Payments", href: "/buyer/payments", active: false },
  { icon: "⭐", label: "My Reviews", href: "/buyer/reviews", active: false },
  { icon: "🔔", label: "Notifications", href: "/buyer/notifications", active: true },
  { icon: "⚙️", label: "Settings", href: "/buyer/settings", active: false },
];

const notifications = [
  { icon: "📦", title: "Order Shipped!", desc: "Your order #TH-2025-41823 has been shipped and is on its way.", time: "2 hours ago", unread: true },
  { icon: "💰", title: "Price Drop Alert!", desc: "Canon DSLR 1300D in your wishlist dropped to ₹16,000!", time: "5 hours ago", unread: true },
  { icon: "✅", title: "Order Delivered", desc: "Your order #TH-2025-39012 has been delivered successfully.", time: "2 days ago", unread: false },
  { icon: "❤️", title: "Item Almost Gone!", desc: "Nike Air Max 90 in your wishlist has only 1 left in stock.", time: "3 days ago", unread: false },
  { icon: "⭐", title: "Leave a Review", desc: "How was your Vintage Denim Jacket? Share your experience!", time: "1 week ago", unread: false },
];

export default function Notifications() {
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
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-black text-gray-900">Notifications 🔔</h1>
            <button className="text-xs text-emerald-600 font-semibold hover:underline">Mark all as read</button>
          </div>
          <div className="space-y-3">
            {notifications.map((n, i) => (
              <div key={i} className={`bg-white rounded-2xl border p-4 flex gap-4 transition ${n.unread ? "border-emerald-200 bg-emerald-50/30" : "border-gray-200"}`}>
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-xl shrink-0">{n.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-black text-gray-900">{n.title}</p>
                    {n.unread && <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>}
                  </div>
                  <p className="text-xs text-gray-600 mt-0.5">{n.desc}</p>
                  <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}