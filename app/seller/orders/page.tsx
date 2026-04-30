"use client";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useState } from "react";

const allOrders = [
  { id: "#TH-2025-48291", buyer: "Priyanka M.", item: "Banarasi Silk Saree", emoji: "🥻", amount: 1200, status: "Processing", date: "Apr 26", address: "Mundgod, Karnataka" },
  { id: "#TH-2025-41823", buyer: "Rahul S.", item: "Vintage Denim Jacket", emoji: "🧥", amount: 899, status: "Shipped", date: "Apr 18", address: "Mumbai, Maharashtra" },
  { id: "#TH-2025-39012", buyer: "Meera K.", item: "Wooden Study Table", emoji: "🪑", amount: 2500, status: "Delivered", date: "Apr 5", address: "Pune, Maharashtra" },
  { id: "#TH-2025-31456", buyer: "Arjun T.", item: "Floral Kurti Set", emoji: "👗", amount: 320, status: "Delivered", date: "Mar 28", address: "Jaipur, Rajasthan" },
  { id: "#TH-2025-28934", buyer: "Sneha R.", item: "Old NCERT Books Set", emoji: "📚", amount: 250, status: "Cancelled", date: "Mar 20", address: "Delhi" },
];

const statusStyle: Record<string, string> = {
  Processing: "bg-blue-50 text-blue-700 border border-blue-200",
  Shipped: "bg-orange-50 text-orange-700 border border-orange-200",
  Delivered: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Cancelled: "bg-red-50 text-red-600 border border-red-200",
};

const nextStatus: Record<string, string> = {
  Processing: "Shipped",
  Shipped: "Delivered",
};

const sidebarLinks = [
  { icon: "📊", label: "Overview", href: "/seller", active: false },
  { icon: "📦", label: "My Listings", href: "/seller/listings", active: false },
  { icon: "🛒", label: "Orders", href: "/seller/orders", active: true },
  { icon: "💰", label: "Earnings", href: "/seller/earnings", active: false },
  { icon: "⭐", label: "Reviews", href: "/seller/reviews", active: false },
  { icon: "👤", label: "Public Profile", href: "/seller/profile", active: false },
  { icon: "⚙️", label: "Settings", href: "/seller/settings", active: false },
];

export default function SellerOrders() {
  const [orders, setOrders] = useState(allOrders);
  const [filter, setFilter] = useState("All");

  const updateStatus = (id: string, newStat: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStat } : o));
  };

  const filtered = filter === "All" ? orders : orders.filter(o => o.status === filter);

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
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-black text-gray-900">Orders 🛒</h1>
            <div className="flex gap-2">
              {["All", "Processing", "Shipped", "Delivered", "Cancelled"].map(f => (
                <button key={f} onClick={() => setFilter(f)} className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition ${filter === f ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-gray-600 border-gray-200 hover:border-emerald-400"}`}>{f}</button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filtered.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-emerald-200 transition">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-2xl shrink-0">{order.emoji}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-black text-gray-900">{order.id}</p>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyle[order.status]}`}>{order.status}</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-700">{order.item}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Buyer: {order.buyer} · {order.date} · 📍 {order.address}</p>
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-base font-black text-emerald-700">₹{order.amount.toLocaleString()}</p>
                      <div className="flex gap-2">
                        {nextStatus[order.status] && (
                          <button
                            onClick={() => updateStatus(order.id, nextStatus[order.status])}
                            className="text-xs bg-emerald-600 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-emerald-700 transition"
                          >
                            Mark as {nextStatus[order.status]}
                          </button>
                        )}
                        <button className="text-xs border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg font-bold hover:border-emerald-400 transition">
                          View Details
                        </button>
                      </div>
                    </div>
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