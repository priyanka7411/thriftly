"use client";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useState } from "react";

const sidebarLinks = [
  { icon: "📊", label: "Overview", href: "/seller", active: false },
  { icon: "📦", label: "My Listings", href: "/seller/listings", active: false },
  { icon: "🛒", label: "Orders", href: "/seller/orders", active: false },
  { icon: "💰", label: "Earnings", href: "/seller/earnings", active: false },
  { icon: "⭐", label: "Reviews", href: "/seller/reviews", active: false },
  { icon: "👤", label: "Public Profile", href: "/seller/profile", active: false },
  { icon: "⚙️", label: "Settings", href: "/seller/settings", active: true },
];

export default function SellerSettings() {
  const [storeName, setStoreName] = useState("Ethnic Finds Store");
  const [bio, setBio] = useState("Premium handwoven ethnic wear from Varanasi.");
  const [saved, setSaved] = useState(false);

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

        <div className="flex-1 space-y-5">
          <h1 className="text-2xl font-black text-gray-900">Seller Settings ⚙️</h1>

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-base font-black text-gray-900 mb-4">Store Information</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Store Name</label>
                <input value={storeName} onChange={e => setStoreName(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 transition" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Store Bio</label>
                <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 transition resize-none" />
              </div>
              {saved && <p className="text-xs text-emerald-600 font-bold">✅ Saved successfully!</p>}
              <button onClick={() => setSaved(true)} className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition">
                Save Changes
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-base font-black text-gray-900 mb-4">Payout Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Bank Account Number</label>
                <input type="text" placeholder="•••• •••• 4521" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 transition" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">IFSC Code</label>
                <input type="text" placeholder="SBIN0001234" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 transition" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">UPI ID</label>
                <input type="text" placeholder="yourname@upi" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 transition" />
              </div>
              <button className="px-6 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition">Update Payout Details</button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-red-200 p-6">
            <h2 className="text-base font-black text-red-600 mb-2">Danger Zone</h2>
            <p className="text-xs text-gray-500 mb-4">Deactivating your store will hide all listings temporarily.</p>
            <button className="text-xs border border-red-300 text-red-500 px-4 py-2 rounded-xl font-bold hover:bg-red-50 transition">Deactivate Store</button>
          </div>
        </div>
      </div>
    </div>
  );
}