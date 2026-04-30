"use client";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useState } from "react";

const sidebarLinks = [
  { icon: "📦", label: "My Orders", href: "/buyer/orders", active: false },
  { icon: "❤️", label: "Wishlist", href: "/buyer/wishlist", active: false },
  { icon: "📍", label: "Addresses", href: "/buyer/addresses", active: false },
  { icon: "💳", label: "Payments", href: "/buyer/payments", active: false },
  { icon: "⭐", label: "My Reviews", href: "/buyer/reviews", active: false },
  { icon: "🔔", label: "Notifications", href: "/buyer/notifications", active: false },
  { icon: "⚙️", label: "Settings", href: "/buyer/settings", active: true },
];

export default function Settings() {
  const [name, setName] = useState("Priyanka Malavade");
  const [email, setEmail] = useState("priyasmalavade@gmail.com");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [saved, setSaved] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-64 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-4 text-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center text-2xl font-black mx-auto mb-3">P</div>
              <p className="text-base font-black text-gray-900">Priyanka Malavade</p>
              <p className="text-xs text-gray-400 mt-0.5">priyasmalavade@gmail.com</p>
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
              <div className="border-t border-gray-100">
                <div className="flex items-center gap-3 px-4 py-3.5 cursor-pointer hover:bg-red-50">
                  <span>🚪</span>
                  <span className="text-sm font-semibold text-red-500">Logout</span>
                </div>
              </div>
            </div>
          </aside>

          <div className="flex-1 space-y-5">
            <h1 className="text-2xl font-black text-gray-900">Settings ⚙️</h1>

            {/* Profile Settings */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-base font-black text-gray-900 mb-4">Profile Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Full Name</label>
                  <input value={name} onChange={e => setName(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 transition" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Email Address</label>
                  <input value={email} onChange={e => setEmail(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 transition" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Phone Number</label>
                  <input value={phone} onChange={e => setPhone(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 transition" />
                </div>
                {saved && <p className="text-xs text-emerald-600 font-bold">✅ Changes saved!</p>}
                <button onClick={() => setSaved(true)} className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition">
                  Save Changes
                </button>
              </div>
            </div>

            {/* Password */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-base font-black text-gray-900 mb-4">Change Password</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Current Password</label>
                  <input type="password" placeholder="••••••••" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 transition" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">New Password</label>
                  <input type="password" placeholder="••••••••" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 transition" />
                </div>
                <button className="px-6 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition">
                  Update Password
                </button>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-base font-black text-gray-900 mb-4">Notification Preferences</h2>
              <div className="space-y-3">
                {[
                  ["Order updates", true],
                  ["Price drop alerts", true],
                  ["New arrivals in wishlist categories", false],
                  ["Promotional emails", false],
                  ["Seller messages", true],
                ].map(([label, checked]) => (
                  <label key={label as string} className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-gray-700 font-medium">{label as string}</span>
                    <input type="checkbox" defaultChecked={checked as boolean} className="w-4 h-4 accent-emerald-600" />
                  </label>
                ))}
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-2xl border border-red-200 p-6">
              <h2 className="text-base font-black text-red-600 mb-2">Danger Zone</h2>
              <p className="text-xs text-gray-500 mb-4">These actions are irreversible. Please be careful.</p>
              <button className="text-xs border border-red-300 text-red-500 px-4 py-2 rounded-xl font-bold hover:bg-red-50 transition">
                🗑️ Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}