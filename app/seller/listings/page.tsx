"use client";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useState } from "react";

const initialListings = [
  { id: 1, name: "Banarasi Silk Saree", price: 1200, status: "Active", views: 214, emoji: "🥻", category: "Ethnic Wear", listed: "2 days ago" },
  { id: 2, name: "Vintage Denim Jacket", price: 899, status: "Active", views: 189, emoji: "🧥", category: "Clothing", listed: "5 days ago" },
  { id: 3, name: "Wooden Study Table", price: 2500, status: "Sold", views: 312, emoji: "🪑", category: "Furniture", listed: "2 weeks ago" },
  { id: 4, name: "Floral Kurti Set", price: 320, status: "Active", views: 112, emoji: "👗", category: "Clothing", listed: "1 week ago" },
  { id: 5, name: "Old NCERT Books Set", price: 250, status: "Inactive", views: 45, emoji: "📚", category: "Books", listed: "3 weeks ago" },
];

const statusStyle: Record<string, string> = {
  Active: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Sold: "bg-gray-100 text-gray-500 border border-gray-200",
  Inactive: "bg-yellow-50 text-yellow-700 border border-yellow-200",
};

const sidebarLinks = [
  { icon: "📊", label: "Overview", href: "/seller", active: false },
  { icon: "📦", label: "My Listings", href: "/seller/listings", active: true },
  { icon: "🛒", label: "Orders", href: "/seller/orders", active: false },
  { icon: "💰", label: "Earnings", href: "/seller/earnings", active: false },
  { icon: "⭐", label: "Reviews", href: "/seller/reviews", active: false },
  { icon: "👤", label: "Public Profile", href: "/seller/profile", active: false },
  { icon: "⚙️", label: "Settings", href: "/seller/settings", active: false },
];

export default function SellerListings() {
  const [listings, setListings] = useState(initialListings);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", price: "", category: "", emoji: "📦" });
  const [filter, setFilter] = useState("All");

  const deleteItem = (id: number) => setListings(prev => prev.filter(l => l.id !== id));

  const addItem = () => {
    if (!newItem.name || !newItem.price) return;
    setListings(prev => [...prev, {
      id: Date.now(), name: newItem.name, price: Number(newItem.price),
      status: "Active", views: 0, emoji: newItem.emoji,
      category: newItem.category || "Other", listed: "Just now"
    }]);
    setNewItem({ name: "", price: "", category: "", emoji: "📦" });
    setShowAddForm(false);
  };

  const filtered = filter === "All" ? listings : listings.filter(l => l.status === filter);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8">

        {/* Sidebar */}
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
            <div className="border-t border-gray-100">
              <div className="flex items-center gap-3 px-4 py-3.5 cursor-pointer hover:bg-red-50">
                <span>🚪</span>
                <span className="text-sm font-semibold text-red-500">Logout</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-black text-gray-900">My Listings 📦</h1>
              <p className="text-sm text-gray-400 mt-0.5">{listings.length} total items</p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-5 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 transition"
            >
              + List New Item
            </button>
          </div>

          {/* Add Form */}
          {showAddForm && (
            <div className="bg-white rounded-2xl border border-emerald-200 p-6 mb-6">
              <h2 className="text-base font-black text-gray-900 mb-4">List a New Item</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Item Name</label>
                  <input value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} placeholder="e.g. Nike Air Max 90" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 transition" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Price (₹)</label>
                  <input value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} placeholder="e.g. 1200" type="number" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 transition" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Category</label>
                  <select value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 bg-white">
                    <option value="">Select category</option>
                    {["Clothing", "Ethnic Wear", "Shoes", "Electronics", "Books", "Furniture", "Gaming", "Beauty", "Bags", "Accessories"].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Emoji Icon</label>
                  <input value={newItem.emoji} onChange={e => setNewItem({...newItem, emoji: e.target.value})} placeholder="📦" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 transition" />
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={addItem} className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition">Add Listing</button>
                <button onClick={() => setShowAddForm(false)} className="px-6 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 transition">Cancel</button>
              </div>
            </div>
          )}

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-4">
            {["All", "Active", "Sold", "Inactive"].map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition ${filter === f ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-gray-600 border-gray-200 hover:border-emerald-400"}`}>{f}</button>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="divide-y divide-gray-100">
              {filtered.map((item) => (
                <div key={item.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition">
                  <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-2xl shrink-0">{item.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-400">{item.category} · Listed {item.listed} · 👁 {item.views} views</p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${statusStyle[item.status]}`}>{item.status}</span>
                  <p className="text-sm font-black text-emerald-700 shrink-0">₹{item.price.toLocaleString()}</p>
                  <div className="flex gap-1 shrink-0">
                    <button className="text-xs border border-gray-200 text-gray-600 px-2.5 py-1 rounded-lg hover:border-emerald-400 hover:text-emerald-700 transition">Edit</button>
                    <button onClick={() => deleteItem(item.id)} className="text-xs border border-red-100 text-red-400 px-2.5 py-1 rounded-lg hover:bg-red-50 transition">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}