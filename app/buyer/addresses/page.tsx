import Navbar from "@/components/Navbar";
import Link from "next/link";

const sidebarLinks = [
  { icon: "📦", label: "My Orders", href: "/buyer/orders", active: false },
  { icon: "❤️", label: "Wishlist", href: "/buyer/wishlist", active: false },
  { icon: "📍", label: "Addresses", href: "/buyer/addresses", active: true },
  { icon: "💳", label: "Payments", href: "/buyer/payments", active: false },
  { icon: "⭐", label: "My Reviews", href: "/buyer/reviews", active: false },
  { icon: "🔔", label: "Notifications", href: "/buyer/notifications", active: false },
  { icon: "⚙️", label: "Settings", href: "/buyer/settings", active: false },
];

export default function Addresses() {
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
            <h1 className="text-2xl font-black text-gray-900">Saved Addresses 📍</h1>
            <button className="px-4 py-2 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 transition">+ Add Address</button>
          </div>
          <div className="space-y-4">
            {[
              { label: "Home 🏠", address: "At Post Chigalli, Near Deepanatheshwar Temple, Mundgod", city: "Karnataka", pin: "581349", default: true },
              { label: "College 🎓", address: "BCA Department, Karnatak University Campus", city: "Dharwad", pin: "580003", default: false },
            ].map((addr) => (
              <div key={addr.label} className="bg-white rounded-2xl border border-gray-200 p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-black text-gray-900">{addr.label}</p>
                      {addr.default && <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">Default</span>}
                    </div>
                    <p className="text-sm text-gray-600">{addr.address}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{addr.city} — {addr.pin} 🇮🇳</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-xs border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg font-medium hover:border-emerald-400 transition">Edit</button>
                    <button className="text-xs border border-red-100 text-red-400 px-3 py-1.5 rounded-lg font-medium hover:bg-red-50 transition">Delete</button>
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