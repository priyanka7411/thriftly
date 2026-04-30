import Navbar from "@/components/Navbar";
import Link from "next/link";

const sidebarLinks = [
  { icon: "📊", label: "Overview", href: "/seller", active: false },
  { icon: "📦", label: "My Listings", href: "/seller/listings", active: false },
  { icon: "🛒", label: "Orders", href: "/seller/orders", active: false },
  { icon: "💰", label: "Earnings", href: "/seller/earnings", active: true },
  { icon: "⭐", label: "Reviews", href: "/seller/reviews", active: false },
  { icon: "👤", label: "Public Profile", href: "/seller/profile", active: false },
  { icon: "⚙️", label: "Settings", href: "/seller/settings", active: false },
];

const transactions = [
  { id: "#TH-2025-48291", item: "Banarasi Silk Saree", emoji: "🥻", gross: 1200, commission: 120, net: 1080, date: "Apr 26", status: "Pending" },
  { id: "#TH-2025-41823", item: "Vintage Denim Jacket", emoji: "🧥", gross: 899, commission: 90, net: 809, date: "Apr 18", status: "Paid" },
  { id: "#TH-2025-39012", item: "Wooden Study Table", emoji: "🪑", gross: 2500, commission: 250, net: 2250, date: "Apr 5", status: "Paid" },
  { id: "#TH-2025-31456", item: "Floral Kurti Set", emoji: "👗", gross: 320, commission: 32, net: 288, date: "Mar 28", status: "Paid" },
];

export default function SellerEarnings() {
  const totalEarnings = transactions.filter(t => t.status === "Paid").reduce((sum, t) => sum + t.net, 0);
  const pendingEarnings = transactions.filter(t => t.status === "Pending").reduce((sum, t) => sum + t.net, 0);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-60 shrink-0">
          <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-4 text-center">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center text-2xl font-black mx-auto mb-3">E</div>
            <p className="text-sm font-black text-gray-900">Ethnic Finds Store</p>
            <p className="text-xs text-gray-400">@ethnic_finds</p>
          </div>
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
          <h1 className="text-2xl font-black text-gray-900 mb-6">Earnings 💰</h1>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Total Earned", value: `₹${totalEarnings.toLocaleString()}`, icon: "💰", color: "bg-emerald-50 text-emerald-600" },
              { label: "Pending Payout", value: `₹${pendingEarnings.toLocaleString()}`, icon: "⏳", color: "bg-orange-50 text-orange-600" },
              { label: "This Month", value: "₹4,850", icon: "📅", color: "bg-blue-50 text-blue-600" },
              { label: "Total Sales", value: "134", icon: "🛒", color: "bg-purple-50 text-purple-600" },
            ].map(stat => (
              <div key={stat.label} className="bg-white rounded-2xl border border-gray-200 p-4">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg mb-3 ${stat.color}`}>{stat.icon}</div>
                <p className="text-xl font-black text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Payout Info */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-black text-emerald-800">Next payout: ₹{pendingEarnings.toLocaleString()}</p>
              <p className="text-xs text-emerald-600 mt-0.5">Estimated by May 3, 2025 · Bank transfer</p>
            </div>
            <button className="text-xs bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-emerald-700 transition">Request Payout</button>
          </div>

          {/* Transactions */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-black text-gray-900">Transaction History</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {["Order", "Item", "Gross", "Commission (10%)", "You Receive", "Date", "Status"].map(h => (
                      <th key={h} className="text-xs font-bold text-gray-500 text-left px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {transactions.map(t => (
                    <tr key={t.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-xs font-bold text-gray-700">{t.id}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span>{t.emoji}</span>
                          <span className="text-xs font-semibold text-gray-800 max-w-24 truncate">{t.item}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs font-semibold text-gray-700">₹{t.gross}</td>
                      <td className="px-4 py-3 text-xs font-semibold text-red-500">−₹{t.commission}</td>
                      <td className="px-4 py-3 text-xs font-black text-emerald-700">₹{t.net}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">{t.date}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${t.status === "Paid" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-orange-50 text-orange-700 border border-orange-200"}`}>{t.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}