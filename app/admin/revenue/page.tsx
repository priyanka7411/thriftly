import Link from "next/link";

const adminLinks = [
  { icon: "📊", label: "Overview", href: "/admin" },
  { icon: "👥", label: "Users", href: "/admin/users" },
  { icon: "🏪", label: "Sellers", href: "/admin/sellers", badge: "3" },
  { icon: "📦", label: "Listings", href: "/admin/listings" },
  { icon: "🛒", label: "Orders", href: "/admin/orders" },
  { icon: "💰", label: "Revenue", href: "/admin/revenue", active: true },
  { icon: "🚨", label: "Reports", href: "/admin/reports", badge: "2" },
  { icon: "⚙️", label: "Settings", href: "/admin/settings" },
];

export default function AdminRevenue() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-gray-900 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white text-sm font-black">T</div>
              <span className="text-xl font-black text-white">Thriftly</span>
            </Link>
            <span className="text-xs bg-red-500 text-white px-2.5 py-1 rounded-full font-bold">Admin</span>
          </div>
          <Link href="/" className="text-xs text-gray-400 hover:text-white">← Back to Site</Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
        <aside className="w-56 shrink-0">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {adminLinks.map((item) => (
              <Link href={item.href} key={item.label}>
                <div className={`flex items-center gap-3 px-4 py-3.5 cursor-pointer transition border-l-4 ${item.active ? "bg-emerald-50 border-emerald-500" : "border-transparent hover:bg-gray-50"}`}>
                  <span>{item.icon}</span>
                  <span className={`text-sm font-semibold flex-1 ${item.active ? "text-emerald-700" : "text-gray-700"}`}>{item.label}</span>
                  {item.badge && <span className="bg-red-500 text-white text-xs font-black px-1.5 py-0.5 rounded-full">{item.badge}</span>}
                </div>
              </Link>
            ))}
          </div>
        </aside>

        <div className="flex-1">
          <h1 className="text-2xl font-black text-gray-900 mb-6">Revenue 💰</h1>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Total Revenue", value: "₹2,40,000", sub: "All time", color: "bg-emerald-50 text-emerald-600" },
              { label: "This Month", value: "₹98,400", sub: "↑ +12%", color: "bg-blue-50 text-blue-600" },
              { label: "This Week", value: "₹24,150", sub: "↑ +18%", color: "bg-purple-50 text-purple-600" },
              { label: "Pending Payouts", value: "₹12,500", sub: "To sellers", color: "bg-orange-50 text-orange-600" },
            ].map(stat => (
              <div key={stat.label} className="bg-white rounded-2xl border border-gray-200 p-4">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg mb-3 ${stat.color}`}>💰</div>
                <p className="text-xl font-black text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
                <p className="text-xs text-emerald-600 font-bold mt-0.5">{stat.sub}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-base font-black text-gray-900 mb-4">Revenue Chart</h2>
            <div className="flex items-end gap-3 h-40">
              {[
                { month: "Nov", val: 45 }, { month: "Dec", val: 65 },
                { month: "Jan", val: 55 }, { month: "Feb", val: 70 },
                { month: "Mar", val: 60 }, { month: "Apr", val: 90 },
              ].map((d) => (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                  <p className="text-xs font-bold text-emerald-700">₹{d.val}K</p>
                  <div className="w-full bg-emerald-200 hover:bg-emerald-500 rounded-t-lg transition cursor-pointer" style={{ height: `${d.val}%` }}></div>
                  <span className="text-xs text-gray-400">{d.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}