"use client";
import Link from "next/link";
import { useState } from "react";

const adminLinks = [
  { icon: "📊", label: "Overview", href: "/admin" },
  { icon: "👥", label: "Users", href: "/admin/users" },
  { icon: "🏪", label: "Sellers", href: "/admin/sellers", badge: "3" },
  { icon: "📦", label: "Listings", href: "/admin/listings", active: true },
  { icon: "🛒", label: "Orders", href: "/admin/orders" },
  { icon: "💰", label: "Revenue", href: "/admin/revenue" },
  { icon: "🚨", label: "Reports", href: "/admin/reports", badge: "2" },
  { icon: "⚙️", label: "Settings", href: "/admin/settings" },
];

const initialListings = [
  { id: 1, name: "Banarasi Silk Saree", seller: "ethnic_finds", price: "₹1,200", category: "Ethnic Wear", emoji: "🥻", status: "Active", views: 214 },
  { id: 2, name: "Vintage Denim Jacket", seller: "maya_thrifts", price: "₹899", category: "Clothing", emoji: "🧥", status: "Active", views: 189 },
  { id: 3, name: "Nike Air Max 90", seller: "sneaker_vault", price: "₹3,500", category: "Shoes", emoji: "👟", status: "Active", views: 431 },
  { id: 4, name: "iPhone 11 64GB", seller: "techresell", price: "₹14,000", category: "Electronics", emoji: "📱", status: "Active", views: 892 },
  { id: 5, name: "iPhone 13 Pro Max", seller: "unknown_seller", price: "₹500", category: "Electronics", emoji: "📱", status: "Flagged", views: 45 },
  { id: 6, name: "Designer Handbag", seller: "luxe_deals", price: "₹800", category: "Bags", emoji: "👜", status: "Flagged", views: 23 },
];

export default function AdminListings() {
  const [listings, setListings] = useState(initialListings);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };
  const remove = (id: number) => { setListings(p => p.filter(l => l.id !== id)); showToast("🗑️ Listing removed."); };

  const filtered = listings.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.seller.toLowerCase().includes(search.toLowerCase())
  );

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

      {toast && <div className="fixed top-20 right-6 bg-gray-900 text-white px-4 py-3 rounded-xl text-sm font-semibold z-50 shadow-lg">{toast}</div>}

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
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-black text-gray-900">Listings 📦</h1>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search listings..." className="border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-emerald-500 w-56" />
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {["Item", "Seller", "Category", "Price", "Views", "Status", "Action"].map(h => (
                    <th key={h} className="text-xs font-bold text-gray-500 text-left px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3"><div className="flex items-center gap-2"><span>{item.emoji}</span><span className="text-sm font-semibold text-gray-800">{item.name}</span></div></td>
                    <td className="px-4 py-3 text-xs text-gray-600">@{item.seller}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">{item.category}</td>
                    <td className="px-4 py-3 text-xs font-black text-emerald-700">{item.price}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">👁 {item.views}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${item.status === "Active" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-600 border border-red-200"}`}>{item.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Link href={`/product/${item.id}`} className="text-xs border border-gray-200 text-gray-600 px-2 py-1 rounded-lg hover:border-emerald-400 transition">View</Link>
                        <button onClick={() => remove(item.id)} className="text-xs border border-red-100 text-red-500 px-2 py-1 rounded-lg hover:bg-red-50 transition">Remove</button>
                      </div>
                    </td>
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