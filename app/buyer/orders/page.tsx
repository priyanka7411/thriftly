"use client";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Order {
  id: number;
  total_amount: number;
  delivery_status: string;
  payment_status: string;
  shipping_address: string;
  created_at: string;
}

const statusStyle: Record<string, string> = {
  processing: "bg-blue-50 text-blue-700 border border-blue-200",
  shipped: "bg-orange-50 text-orange-700 border border-orange-200",
  delivered: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  cancelled: "bg-red-50 text-red-600 border border-red-200",
};

const sidebarLinks = [
  { icon: "📦", label: "My Orders", href: "/buyer/orders", active: true },
  { icon: "❤️", label: "Wishlist", href: "/buyer/wishlist", active: false },
  { icon: "📍", label: "Addresses", href: "/buyer/addresses", active: false },
  { icon: "💳", label: "Payments", href: "/buyer/payments", active: false },
  { icon: "⭐", label: "My Reviews", href: "/buyer/reviews", active: false },
  { icon: "🔔", label: "Notifications", href: "/buyer/notifications", active: false },
  { icon: "⚙️", label: "Settings", href: "/buyer/settings", active: false },
];

export default function BuyerOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);

    if (user) {
      const { data } = await supabase
        .from("orders")
        .select("*")
        .eq("buyer_id", user.id)
        .order("created_at", { ascending: false });

      if (data) setOrders(data);
    }
    setLoading(false);
  };

  const filtered = filter === "All"
    ? orders
    : orders.filter(o => o.delivery_status.toLowerCase() === filter.toLowerCase());

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar */}
          <aside className="w-full lg:w-64 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-4 text-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center text-2xl font-black mx-auto mb-3">
                {user?.email?.[0].toUpperCase() || "P"}
              </div>
              <p className="text-base font-black text-gray-900">{user?.user_metadata?.full_name || "My Account"}</p>
              <p className="text-xs text-gray-400 mt-0.5">{user?.email}</p>
              <div className="mt-3 flex items-center justify-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                <span className="text-xs text-emerald-700 font-semibold">Verified Buyer</span>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              {sidebarLinks.map((item) => (
                <Link href={item.href} key={item.label}>
                  <div className={`flex items-center gap-3 px-4 py-3.5 cursor-pointer transition border-l-4 ${item.active ? "bg-emerald-50 border-emerald-500" : "border-transparent hover:bg-gray-50"}`}>
                    <span>{item.icon}</span>
                    <span className={`text-sm font-semibold ${item.active ? "text-emerald-700" : "text-gray-700"}`}>{item.label}</span>
                    {item.active && <span className="ml-auto text-emerald-500 text-xs">→</span>}
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
              <h1 className="text-2xl font-black text-gray-900">My Orders 📦</h1>
              <div className="flex gap-2">
                {["All", "Processing", "Shipped", "Delivered", "Cancelled"].map((f) => (
                  <button key={f} onClick={() => setFilter(f)} className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition ${filter === f ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-gray-600 border-gray-200 hover:border-emerald-400"}`}>{f}</button>
                ))}
              </div>
            </div>

            {loading && (
              <div className="space-y-4">
                {Array(3).fill(0).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-200 p-5 animate-pulse">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
                      <div className="flex-1 space-y-2">
                        <div className="bg-gray-200 h-4 rounded w-1/3"></div>
                        <div className="bg-gray-200 h-3 rounded w-1/4"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && filtered.length === 0 && (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
                <div className="text-5xl mb-4">📦</div>
                <p className="text-lg font-black text-gray-700">No orders yet</p>
                <p className="text-sm text-gray-400 mt-1">Start shopping to see your orders here!</p>
                <Link href="/browse">
                  <button className="mt-4 px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition">
                    Browse Items
                  </button>
                </Link>
              </div>
            )}

            <div className="space-y-4">
              {filtered.map((order) => (
                <div key={order.id} className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-emerald-200 transition">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-xl">📦</div>
                      <div>
                        <p className="text-sm font-black text-gray-900">Order #TH-{order.id}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${statusStyle[order.delivery_status] || "bg-gray-100 text-gray-600"}`}>
                        {order.delivery_status}
                      </span>
                      <p className="text-sm font-black text-gray-900">₹{order.total_amount.toLocaleString()}</p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 mb-3 truncate">📍 {order.shipping_address}</p>

                  <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                    <button className="text-xs bg-emerald-600 text-white px-4 py-1.5 rounded-lg font-bold hover:bg-emerald-700 transition">Track Order</button>
                    <button className="text-xs border border-gray-200 text-gray-600 px-4 py-1.5 rounded-lg font-bold hover:border-emerald-400 transition">View Details</button>
                    {order.delivery_status === "delivered" && (
                      <button className="text-xs border border-amber-200 text-amber-600 px-4 py-1.5 rounded-lg font-bold hover:bg-amber-50 transition">⭐ Write Review</button>
                    )}
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