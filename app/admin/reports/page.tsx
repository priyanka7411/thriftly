"use client";
import Link from "next/link";
import { useState } from "react";

const adminLinks = [
  { icon: "📊", label: "Overview", href: "/admin" },
  { icon: "👥", label: "Users", href: "/admin/users" },
  { icon: "🏪", label: "Sellers", href: "/admin/sellers", badge: "3" },
  { icon: "📦", label: "Listings", href: "/admin/listings" },
  { icon: "🛒", label: "Orders", href: "/admin/orders" },
  { icon: "💰", label: "Revenue", href: "/admin/revenue" },
  { icon: "🚨", label: "Reports", href: "/admin/reports", active: true, badge: "2" },
  { icon: "⚙️", label: "Settings", href: "/admin/settings" },
];

const initialReports = [
  { id: 1, type: "Fake Listing", reporter: "Priyanka M.", target: "iPhone 13 Pro Max", seller: "unknown_seller", date: "Apr 26", status: "Pending" },
  { id: 2, type: "Counterfeit Item", reporter: "Rahul S.", target: "Designer Handbag", seller: "luxe_deals", date: "Apr 25", status: "Pending" },
  { id: 3, type: "Wrong Item Received", reporter: "Meera K.", target: "Banarasi Silk Saree", seller: "ethnic_finds", date: "Apr 10", status: "Resolved" },
];

export default function AdminReports() {
  const [reports, setReports] = useState(initialReports);
  const [toast, setToast] = useState("");
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };
  const resolve = (id: number) => { setReports(p => p.map(r => r.id === id ? { ...r, status: "Resolved" } : r)); showToast("✅ Report resolved!"); };
  const dismiss = (id: number) => { setReports(p => p.map(r => r.id === id ? { ...r, status: "Dismissed" } : r)); showToast("Report dismissed."); };

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
          <h1 className="text-2xl font-black text-gray-900 mb-6">Reports 🚨</h1>
          <div className="space-y-4">
            {reports.map(r => (
              <div key={r.id} className="bg-white rounded-2xl border border-gray-200 p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded-full font-semibold">{r.type}</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${r.status === "Pending" ? "bg-orange-50 text-orange-700 border border-orange-200" : r.status === "Resolved" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-gray-100 text-gray-500"}`}>{r.status}</span>
                    </div>
                    <p className="text-sm font-bold text-gray-900">Re: {r.target}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Reported by {r.reporter} · Against @{r.seller} · {r.date}</p>
                  </div>
                  {r.status === "Pending" && (
                    <div className="flex gap-2">
                      <button onClick={() => resolve(r.id)} className="text-xs bg-emerald-600 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-emerald-700 transition">Resolve</button>
                      <button onClick={() => dismiss(r.id)} className="text-xs border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg font-bold hover:bg-gray-50 transition">Dismiss</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}