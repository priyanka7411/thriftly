"use client";
import Link from "next/link";
import { useState } from "react";

const adminLinks = [
  { icon: "📊", label: "Overview", href: "/admin" },
  { icon: "👥", label: "Users", href: "/admin/users" },
  { icon: "🏪", label: "Sellers", href: "/admin/sellers", active: true, badge: "3" },
  { icon: "📦", label: "Listings", href: "/admin/listings" },
  { icon: "🛒", label: "Orders", href: "/admin/orders" },
  { icon: "💰", label: "Revenue", href: "/admin/revenue" },
  { icon: "🚨", label: "Reports", href: "/admin/reports", badge: "2" },
  { icon: "⚙️", label: "Settings", href: "/admin/settings" },
];

const initialPending = [
  { name: "Riya's Closet", email: "riya@gmail.com", location: "🇮🇳 Mumbai", applied: "2 days ago", items: 12, avatar: "R", category: "Clothing" },
  { name: "TechResell Hub", email: "techresell@gmail.com", location: "🇮🇳 Bangalore", applied: "3 days ago", items: 8, avatar: "T", category: "Electronics" },
  { name: "Vintage Vault", email: "vintagevault@gmail.com", location: "🇺🇸 New York", applied: "5 days ago", items: 25, avatar: "V", category: "Vintage" },
];

const approvedSellers = [
  { name: "Ethnic Finds Store", email: "ethnic@gmail.com", location: "🇮🇳 Varanasi", rating: 4.9, sales: 134, avatar: "E", status: "Active" },
  { name: "Sneaker Vault", email: "sneaker@gmail.com", location: "🇺🇸 New York", rating: 4.8, sales: 89, avatar: "S", status: "Active" },
  { name: "Bookworm99", email: "books@gmail.com", location: "🇮🇳 Pune", rating: 4.9, sales: 210, avatar: "B", status: "Active" },
];

export default function AdminSellers() {
  const [pending, setPending] = useState(initialPending);
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };
  const approve = (email: string) => { setPending(p => p.filter(s => s.email !== email)); showToast("✅ Seller approved!"); };
  const reject = (email: string) => { setPending(p => p.filter(s => s.email !== email)); showToast("❌ Seller rejected."); };

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

        <div className="flex-1 space-y-6">
          <h1 className="text-2xl font-black text-gray-900">Sellers 🏪</h1>

          {/* Pending */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-black text-gray-900">Pending Approvals</h2>
              {pending.length > 0 && <span className="bg-red-500 text-white text-xs font-black px-2 py-0.5 rounded-full">{pending.length}</span>}
            </div>
            {pending.length === 0 ? (
              <div className="px-6 py-10 text-center"><p className="text-2xl mb-2">🎉</p><p className="text-sm font-bold text-gray-700">All caught up!</p></div>
            ) : (
              <div className="divide-y divide-gray-100">
                {pending.map(s => (
                  <div key={s.email} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50">
                    <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center text-sm font-black">{s.avatar}</div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-900">{s.name}</p>
                      <p className="text-xs text-gray-400">{s.email} · {s.location} · {s.category}</p>
                      <p className="text-xs text-gray-400">Applied {s.applied} · {s.items} items planned</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => approve(s.email)} className="text-xs bg-emerald-600 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-emerald-700 transition">✓ Approve</button>
                      <button onClick={() => reject(s.email)} className="text-xs border border-red-200 text-red-500 px-3 py-1.5 rounded-lg font-bold hover:bg-red-50 transition">✗ Reject</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Approved */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-black text-gray-900">Active Sellers ({approvedSellers.length})</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {approvedSellers.map(s => (
                <div key={s.email} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center text-sm font-black">{s.avatar}</div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900">{s.name}</p>
                    <p className="text-xs text-gray-400">{s.email} · {s.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-amber-500">★ {s.rating}</p>
                    <p className="text-xs text-gray-400">{s.sales} sales</p>
                  </div>
                  <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">{s.status}</span>
                  <button className="text-xs border border-red-100 text-red-500 px-3 py-1.5 rounded-lg font-bold hover:bg-red-50 transition">Suspend</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}