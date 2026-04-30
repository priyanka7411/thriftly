"use client";
import Link from "next/link";
import { useState } from "react";

const adminLinks = [
  { icon: "📊", label: "Overview", href: "/admin" },
  { icon: "👥", label: "Users", href: "/admin/users" },
  { icon: "🏪", label: "Sellers", href: "/admin/sellers", badge: "3" },
  { icon: "📦", label: "Listings", href: "/admin/listings" },
  { icon: "🛒", label: "Orders", href: "/admin/orders", active: true },
  { icon: "💰", label: "Revenue", href: "/admin/revenue" },
  { icon: "🚨", label: "Reports", href: "/admin/reports", badge: "2" },
  { icon: "⚙️", label: "Settings", href: "/admin/settings" },
];

const allOrders = [
  { id: "#TH-2025-48291", buyer: "Priyanka M.", seller: "ethnic_finds", item: "Banarasi Silk Saree", emoji: "🥻", amount: "₹1,200", commission: "₹120", status: "Processing", date: "Apr 26" },
  { id: "#TH-2025-41823", buyer: "Rahul S.", seller: "sneaker_vault", item: "Nike Air Max 90", emoji: "👟", amount: "₹3,500", commission: "₹350", status: "Shipped", date: "Apr 18" },
  { id: "#TH-2025-39012", buyer: "Meera K.", seller: "gear_resell", item: "Canon DSLR 1300D", emoji: "📷", amount: "₹18,000", commission: "₹1,800", status: "Delivered", date: "Apr 5" },
  { id: "#TH-2025-31456", buyer: "Arjun T.", seller: "maya_thrifts", item: "Vintage Denim Jacket", emoji: "🧥", amount: "₹899", commission: "₹90", status: "Delivered", date: "Mar 28" },
  { id: "#TH-2025-28934", buyer: "Sneha R.", seller: "bookworm99", item: "Harry Potter Box Set", emoji: "📚", amount: "₹550", commission: "₹55", status: "Cancelled", date: "Mar 20" },
];

const statusStyle: Record<string, string> = {
  Processing: "bg-blue-50 text-blue-700 border border-blue-200",
  Shipped: "bg-orange-50 text-orange-700 border border-orange-200",
  Delivered: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Cancelled: "bg-red-50 text-red-600 border border-red-200",
};

export default function AdminOrders() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = allOrders
    .filter(o => filter === "All" || o.status === filter)
    .filter(o => o.item.toLowerCase().includes(search.toLowerCase()) || o.buyer.toLowerCase().includes(search.toLowerCase()));

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
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <h1 className="text-2xl font-black text-gray-900">Orders 🛒</h1>
            <div className="flex gap-3">
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search orders..." className="border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-emerald-500 w-48" />
              <div className="flex gap-2">
                {["All", "Processing", "Shipped", "Delivered", "Cancelled"].map(f => (
                  <button key={f} onClick={() => setFilter(f)} className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition ${filter === f ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-gray-600 border-gray-200 hover:border-emerald-400"}`}>{f}</button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {["Order ID", "Item", "Buyer", "Seller", "Amount", "Commission", "Date", "Status"].map(h => (
                    <th key={h} className="text-xs font-bold text-gray-500 text-left px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-xs font-bold text-gray-700">{order.id}</td>
                    <td className="px-4 py-3"><div className="flex items-center gap-2"><span>{order.emoji}</span><span className="text-xs font-semibold text-gray-800 max-w-24 truncate">{order.item}</span></div></td>
                    <td className="px-4 py-3 text-xs text-gray-600">{order.buyer}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">@{order.seller}</td>
                    <td className="px-4 py-3 text-xs font-black text-gray-900">{order.amount}</td>
                    <td className="px-4 py-3 text-xs font-bold text-emerald-600">{order.commission}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{order.date}</td>
                    <td className="px-4 py-3"><span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusStyle[order.status]}`}>{order.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}