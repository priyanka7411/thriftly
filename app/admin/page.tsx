
"use client";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useState } from "react";

const initialPendingSellers = [
  { name: "Riya's Closet", email: "riya@gmail.com", location: "🇮🇳 Mumbai", applied: "2 days ago", items: 12, avatar: "R" },
  { name: "TechResell Hub", email: "techresell@gmail.com", location: "🇮🇳 Bangalore", applied: "3 days ago", items: 8, avatar: "T" },
  { name: "Vintage Vault", email: "vintagevault@gmail.com", location: "🇺🇸 New York", applied: "5 days ago", items: 25, avatar: "V" },
];

const initialFlagged = [
  { name: "iPhone 13 Pro Max", seller: "unknown_seller", reason: "Suspicious pricing", emoji: "📱", price: "₹500" },
  { name: "Designer Handbag", seller: "luxe_deals", reason: "Possible counterfeit", emoji: "👜", price: "₹800" },
];

const recentOrders = [
  { id: "#TH-2025-48291", buyer: "Priyanka M.", seller: "ethnic_finds", item: "Banarasi Silk Saree", emoji: "🥻", amount: "₹1,200", commission: "₹120", status: "Processing" },
  { id: "#TH-2025-41823", buyer: "Rahul S.", seller: "sneaker_vault", item: "Nike Air Max 90", emoji: "👟", amount: "₹3,500", commission: "₹350", status: "Shipped" },
  { id: "#TH-2025-39012", buyer: "Meera K.", seller: "gear_resell", item: "Canon DSLR 1300D", emoji: "📷", amount: "₹18,000", commission: "₹1,800", status: "Delivered" },
  { id: "#TH-2025-31456", buyer: "Arjun T.", seller: "maya_thrifts", item: "Vintage Denim Jacket", emoji: "🧥", amount: "₹899", commission: "₹90", status: "Delivered" },
  { id: "#TH-2025-28934", buyer: "Sneha R.", seller: "bookworm99", item: "Harry Potter Box Set", emoji: "📚", amount: "₹550", commission: "₹55", status: "Cancelled" },
];

const statusStyle: Record<string, string> = {
  Processing: "bg-blue-50 text-blue-700 border border-blue-200",
  Shipped: "bg-orange-50 text-orange-700 border border-orange-200",
  Delivered: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Cancelled: "bg-red-50 text-red-600 border border-red-200",
};

const adminLinks = [
  { icon: "📊", label: "Overview", href: "/admin" },
  { icon: "👥", label: "Users", href: "/admin/users" },
  { icon: "🏪", label: "Sellers", href: "/admin/sellers", badge: "3" },
  { icon: "📦", label: "Listings", href: "/admin/listings" },
  { icon: "🛒", label: "Orders", href: "/admin/orders" },
  { icon: "💰", label: "Revenue", href: "/admin/revenue" },
  { icon: "🚨", label: "Reports", href: "/admin/reports", badge: "2" },
  { icon: "⚙️", label: "Settings", href: "/admin/settings" },
];

export default function AdminPanel() {
  const [pendingSellers, setPendingSellers] = useState(initialPendingSellers);
  const [flagged, setFlagged] = useState(initialFlagged);
  const [orders, setOrders] = useState(recentOrders);
  const [activeLink, setActiveLink] = useState("Overview");
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const approveSeller = (email: string) => {
    setPendingSellers(prev => prev.filter(s => s.email !== email));
    showToast("✅ Seller approved successfully!");
  };

  const rejectSeller = (email: string) => {
    setPendingSellers(prev => prev.filter(s => s.email !== email));
    showToast("❌ Seller rejected.");
  };

  const removeListing = (name: string) => {
    setFlagged(prev => prev.filter(f => f.name !== name));
    showToast("🗑️ Listing removed.");
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* Admin Navbar */}
      <header className="bg-gray-900 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white text-sm font-black">T</div>
                <span className="text-xl font-black text-white">Thriftly</span>
              </div>
            </Link>
            <span className="text-xs bg-red-500 text-white px-2.5 py-1 rounded-full font-bold">Admin</span>
          </div>
          <div className="flex items-center gap-4">
            {pendingSellers.length > 0 && (
              <span className="text-xs text-amber-400 font-semibold">🔔 {pendingSellers.length} pending approvals</span>
            )}
            <Link href="/" className="text-xs text-gray-400 hover:text-white transition">← Back to Site</Link>
            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-black">A</div>
          </div>
        </div>
      </header>

      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-6 bg-gray-900 text-white px-4 py-3 rounded-xl text-sm font-semibold z-50 shadow-lg">
          {toast}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-gray-900">Admin Panel 🛠️</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage Thriftly — sellers, orders, listings & platform health</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar */}
          <aside className="w-full lg:w-56 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              {adminLinks.map((item) => (
                <div
                  key={item.label}
                  onClick={() => setActiveLink(item.label)}
                  className={`flex items-center gap-3 px-4 py-3.5 cursor-pointer transition border-l-4 ${activeLink === item.label ? "bg-emerald-50 border-emerald-500" : "border-transparent hover:bg-gray-50"}`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span className={`text-sm font-semibold flex-1 ${activeLink === item.label ? "text-emerald-700" : "text-gray-700"}`}>{item.label}</span>
                  {item.badge && (
                    <span className="bg-red-500 text-white text-xs font-black px-1.5 py-0.5 rounded-full">{item.badge}</span>
                  )}
                </div>
              ))}
              <div className="border-t border-gray-100">
                <Link href="/">
                  <div className="flex items-center gap-3 px-4 py-3.5 cursor-pointer hover:bg-red-50 transition">
                    <span>🚪</span>
                    <span className="text-sm font-semibold text-red-500">Logout</span>
                  </div>
                </Link>
              </div>
            </div>
          </aside>

          {/* Main */}
          <div className="flex-1 space-y-6">

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: "👥", label: "Total Users", value: "12,481", sub: "+124 this week", color: "bg-blue-50 text-blue-600" },
                { icon: "🏪", label: "Active Sellers", value: "5,230", sub: `${pendingSellers.length} pending approval`, color: "bg-purple-50 text-purple-600" },
                { icon: "📦", label: "Total Listings", value: "48,920", sub: "+890 this week", color: "bg-emerald-50 text-emerald-600" },
                { icon: "💰", label: "Platform Revenue", value: "₹2.4L", sub: "+18% this month", color: "bg-amber-50 text-amber-600" },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-2xl border border-gray-200 p-4">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg mb-3 ${stat.color}`}>{stat.icon}</div>
                  <p className="text-xl font-black text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">{stat.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{stat.sub}</p>
                </div>
              ))}
            </div>

            {/* Revenue Chart */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-black text-gray-900">Platform Revenue</h2>
                  <p className="text-xs text-gray-400 mt-0.5">10% commission per transaction</p>
                </div>
                <select className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:border-emerald-500 bg-white text-gray-600">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 3 months</option>
                </select>
              </div>
              <div className="flex items-end gap-2 h-28">
                {[30, 55, 40, 75, 60, 90, 70].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full bg-emerald-200 hover:bg-emerald-500 rounded-t-lg transition cursor-pointer" style={{ height: `${h}%` }}></div>
                    <span className="text-xs text-gray-400">{["M","T","W","T","F","S","S"][i]}</span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-4 mt-5 pt-4 border-t border-gray-100">
                {[["This Week", "₹24,150", "↑ +18%", "text-emerald-600"], ["This Month", "₹98,400", "↑ +12%", "text-emerald-600"], ["Total", "₹2,40,000", "All time", "text-gray-500"]].map(([label, val, sub, color]) => (
                  <div key={label}>
                    <p className="text-xs text-gray-400">{label}</p>
                    <p className="text-lg font-black text-gray-900">{val}</p>
                    <p className={`text-xs font-bold ${color}`}>{sub}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Pending Seller Approvals */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-black text-gray-900">Pending Seller Approvals</h2>
                  {pendingSellers.length > 0 && (
                    <span className="bg-red-500 text-white text-xs font-black px-2 py-0.5 rounded-full">{pendingSellers.length}</span>
                  )}
                </div>
              </div>
              {pendingSellers.length === 0 ? (
                <div className="px-6 py-8 text-center">
                  <p className="text-2xl mb-2">🎉</p>
                  <p className="text-sm font-bold text-gray-700">All caught up!</p>
                  <p className="text-xs text-gray-400">No pending seller approvals</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {pendingSellers.map((seller) => (
                    <div key={seller.email} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition">
                      <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center text-sm font-black shrink-0">{seller.avatar}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900">{seller.name}</p>
                        <p className="text-xs text-gray-400">{seller.email} · {seller.location} · Applied {seller.applied}</p>
                        <p className="text-xs text-gray-400">{seller.items} items planned</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button onClick={() => approveSeller(seller.email)} className="text-xs bg-emerald-600 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-emerald-700 transition">✓ Approve</button>
                        <button onClick={() => rejectSeller(seller.email)} className="text-xs border border-red-200 text-red-500 px-3 py-1.5 rounded-lg font-bold hover:bg-red-50 transition">✗ Reject</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Flagged Listings */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-black text-gray-900">🚨 Flagged Listings</h2>
                  {flagged.length > 0 && <span className="bg-red-500 text-white text-xs font-black px-2 py-0.5 rounded-full">{flagged.length}</span>}
                </div>
              </div>
              {flagged.length === 0 ? (
                <div className="px-6 py-8 text-center">
                  <p className="text-2xl mb-2">✅</p>
                  <p className="text-sm font-bold text-gray-700">No flagged listings!</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {flagged.map((item) => (
                    <div key={item.name} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition">
                      <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-xl shrink-0">{item.emoji}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-400">@{item.seller} · Listed at {item.price}</p>
                        <p className="text-xs text-red-500 font-semibold mt-0.5">⚠️ {item.reason}</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button onClick={() => removeListing(item.name)} className="text-xs border border-red-200 text-red-500 px-3 py-1.5 rounded-lg font-bold hover:bg-red-50 transition">Remove</button>
                        <button className="text-xs border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg font-bold hover:bg-gray-50 transition">Review</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="text-base font-black text-gray-900">Recent Orders</h2>
                <Link href="/admin" className="text-xs text-emerald-600 font-semibold hover:underline">View all →</Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      {["Order ID", "Item", "Buyer", "Seller", "Amount", "Commission", "Status", "Action"].map((h) => (
                        <th key={h} className="text-xs font-bold text-gray-500 text-left px-4 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3 text-xs font-bold text-gray-700">{order.id}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{order.emoji}</span>
                            <span className="text-xs font-semibold text-gray-800 max-w-24 truncate">{order.item}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-600">{order.buyer}</td>
                        <td className="px-4 py-3 text-xs text-gray-600">@{order.seller}</td>
                        <td className="px-4 py-3 text-xs font-black text-gray-900">{order.amount}</td>
                        <td className="px-4 py-3 text-xs font-bold text-emerald-600">{order.commission}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusStyle[order.status]}`}>{order.status}</span>
                        </td>
                        <td className="px-4 py-3">
                          <Link href={`/order-confirmation`} className="text-xs text-emerald-600 font-semibold hover:underline">View</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: "📧", label: "Send Newsletter", color: "bg-blue-50 border-blue-200 hover:bg-blue-100", action: () => showToast("📧 Newsletter sent to all users!") },
                { icon: "💸", label: "Process Payouts", color: "bg-emerald-50 border-emerald-200 hover:bg-emerald-100", action: () => showToast("💸 Payouts processed successfully!") },
                { icon: "📊", label: "Export Report", color: "bg-purple-50 border-purple-200 hover:bg-purple-100", action: () => showToast("📊 Report exported!") },
                { icon: "🔧", label: "Platform Settings", color: "bg-gray-50 border-gray-200 hover:bg-gray-100", action: () => showToast("🔧 Opening settings...") },
              ].map((action) => (
                <button key={action.label} onClick={action.action} className={`flex items-center gap-3 p-4 rounded-2xl border transition cursor-pointer ${action.color}`}>
                  <span className="text-2xl">{action.icon}</span>
                  <span className="text-sm font-bold text-gray-700">{action.label}</span>
                </button>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}