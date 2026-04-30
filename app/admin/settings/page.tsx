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
  { icon: "🚨", label: "Reports", href: "/admin/reports", badge: "2" },
  { icon: "⚙️", label: "Settings", href: "/admin/settings", active: true },
];

export default function AdminSettings() {
  const [commission, setCommission] = useState("10");
  const [minPayout, setMinPayout] = useState("500");
  const [saved, setSaved] = useState(false);

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

        <div className="flex-1 space-y-5">
          <h1 className="text-2xl font-black text-gray-900">Platform Settings ⚙️</h1>

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-base font-black text-gray-900 mb-4">Business Rules</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Platform Commission (%)</label>
                <input value={commission} onChange={e => setCommission(e.target.value)} type="number" className="w-48 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 transition" />
                <p className="text-xs text-gray-400 mt-1">Currently charging {commission}% per sale</p>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Minimum Payout Amount (₹)</label>
                <input value={minPayout} onChange={e => setMinPayout(e.target.value)} type="number" className="w-48 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 transition" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Free Shipping Threshold (₹)</label>
                <input defaultValue="999" type="number" className="w-48 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 transition" />
              </div>
              {saved && <p className="text-xs text-emerald-600 font-bold">✅ Settings saved!</p>}
              <button onClick={() => setSaved(true)} className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition">Save Settings</button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-base font-black text-gray-900 mb-4">Platform Status</h2>
            <div className="space-y-3">
              {[
                ["Maintenance Mode", false],
                ["New Seller Registrations", true],
                ["Buyer Protection", true],
                ["Email Notifications", true],
              ].map(([label, checked]) => (
                <label key={label as string} className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm text-gray-700 font-medium">{label as string}</span>
                  <input type="checkbox" defaultChecked={checked as boolean} className="w-4 h-4 accent-emerald-600" />
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}