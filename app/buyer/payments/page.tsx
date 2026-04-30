import Navbar from "@/components/Navbar";
import Link from "next/link";

const sidebarLinks = [
  { icon: "📦", label: "My Orders", href: "/buyer/orders", active: false },
  { icon: "❤️", label: "Wishlist", href: "/buyer/wishlist", active: false },
  { icon: "📍", label: "Addresses", href: "/buyer/addresses", active: false },
  { icon: "💳", label: "Payments", href: "/buyer/payments", active: true },
  { icon: "⭐", label: "My Reviews", href: "/buyer/reviews", active: false },
  { icon: "🔔", label: "Notifications", href: "/buyer/notifications", active: false },
  { icon: "⚙️", label: "Settings", href: "/buyer/settings", active: false },
];

export default function Payments() {
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
            <h1 className="text-2xl font-black text-gray-900">Saved Payments 💳</h1>
            <button className="px-4 py-2 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 transition">+ Add Card</button>
          </div>
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 rounded-2xl p-6 text-white">
              <p className="text-xs font-semibold text-emerald-200 mb-4">VISA •••• •••• •••• 3456</p>
              <p className="text-2xl font-black tracking-widest mb-4">•••• •••• •••• 3456</p>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs text-emerald-200">Card Holder</p>
                  <p className="text-sm font-bold">Priyanka Malavade</p>
                </div>
                <div>
                  <p className="text-xs text-emerald-200">Expires</p>
                  <p className="text-sm font-bold">09/27</p>
                </div>
                <span className="text-xs bg-white/20 px-2 py-1 rounded-full font-semibold">Default</span>
              </div>
            </div>
            <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-6 text-center cursor-pointer hover:border-emerald-400 transition">
              <p className="text-2xl mb-2">➕</p>
              <p className="text-sm font-bold text-gray-600">Add a new card or UPI</p>
              <p className="text-xs text-gray-400 mt-1">Visa, Mastercard, RuPay, UPI</p>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-base font-black text-gray-900 mb-4">Payment History</h2>
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="divide-y divide-gray-100">
                {[
                  { order: "#TH-2025-48291", date: "Apr 26", amount: "₹5,250", method: "Visa 3456", status: "Paid" },
                  { order: "#TH-2025-41823", date: "Apr 10", amount: "₹3,500", method: "Visa 3456", status: "Paid" },
                  { order: "#TH-2025-39012", date: "Mar 28", amount: "₹2,100", method: "UPI", status: "Paid" },
                  { order: "#TH-2025-31456", date: "Mar 12", amount: "₹899", method: "Visa 3456", status: "Refunded" },
                ].map((p) => (
                  <div key={p.order} className="flex items-center justify-between px-5 py-4">
                    <div>
                      <p className="text-sm font-bold text-gray-900">{p.order}</p>
                      <p className="text-xs text-gray-400">{p.date} · {p.method}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-gray-900">{p.amount}</p>
                      <span className={`text-xs font-semibold ${p.status === "Paid" ? "text-emerald-600" : "text-orange-500"}`}>{p.status}</span>
                    </div>
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