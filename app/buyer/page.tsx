"use client";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface Order {
  id: number;
  total_amount: number;
  delivery_status: string;
  created_at: string;
}

const wishlist = [
  { name: "Canon DSLR 1300D", price: "₹18,000", original: "₹45,000", emoji: "📷", seller: "gear_resell", tag: "60% off", id: 7 },
  { name: "PS4 Controller", price: "₹1,800", original: "₹4,500", emoji: "🎮", seller: "gamer_hub", tag: "60% off", id: 10 },
  { name: "Leather Tote Bag", price: "₹1,100", original: "₹3,500", emoji: "👜", seller: "baghouse", tag: "68% off", id: 8 },
];

const statusStyle: Record<string, string> = {
  processing: "bg-blue-50 text-blue-700 border border-blue-200",
  delivered: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  cancelled: "bg-red-50 text-red-600 border border-red-200",
  shipped: "bg-orange-50 text-orange-700 border border-orange-200",
};

export default function BuyerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }
    setUser(user);

    const { data } = await supabase
      .from("orders")
      .select("*")
      .eq("buyer_id", user.id)
      .order("created_at", { ascending: false })
      .limit(4);

    if (data) setOrders(data);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const totalSpent = orders.reduce((sum, o) => sum + o.total_amount, 0);
  const delivered = orders.filter(o => o.delivery_status === "delivered").length;
  const processing = orders.filter(o => o.delivery_status === "processing").length;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-8">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-gray-900">My Account 👤</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Welcome back, {user?.user_metadata?.full_name?.split(" ")[0] || "there"}! 👋
            </p>
          </div>
          <Link href="/browse">
            <button className="px-5 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 transition">
              🛍️ Continue Shopping
            </button>
          </Link>
        </div>

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
              {[
                { icon: "📦", label: "My Orders", href: "/buyer/orders", active: true },
                { icon: "❤️", label: "Wishlist", href: "/buyer/wishlist" },
                { icon: "📍", label: "Addresses", href: "/buyer/addresses" },
                { icon: "💳", label: "Payments", href: "/buyer/payments" },
                { icon: "⭐", label: "My Reviews", href: "/buyer/reviews" },
                { icon: "🔔", label: "Notifications", href: "/buyer/notifications" },
                { icon: "⚙️", label: "Settings", href: "/buyer/settings" },
              ].map((item) => (
                <Link href={item.href} key={item.label}>
                  <div className={`flex items-center gap-3 px-4 py-3.5 cursor-pointer transition border-l-4 ${item.active ? "bg-emerald-50 border-emerald-500 text-emerald-700" : "border-transparent hover:bg-gray-50 text-gray-600"}`}>
                    <span>{item.icon}</span>
                    <span className="text-sm font-semibold">{item.label}</span>
                    {item.active && <span className="ml-auto text-emerald-500 text-xs">→</span>}
                  </div>
                </Link>
              ))}
              <div className="border-t border-gray-100">
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-red-50 transition text-left">
                  <span>🚪</span>
                  <span className="text-sm font-semibold text-red-500">Logout</span>
                </button>
              </div>
            </div>
          </aside>

          {/* Main */}
          <div className="flex-1 space-y-6">

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: "📦", label: "Total Orders", value: orders.length.toString(), color: "bg-blue-50 text-blue-600" },
                { icon: "✅", label: "Delivered", value: delivered.toString(), color: "bg-emerald-50 text-emerald-600" },
                { icon: "⏳", label: "Processing", value: processing.toString(), color: "bg-orange-50 text-orange-600" },
                { icon: "💸", label: "Total Spent", value: `₹${totalSpent.toLocaleString()}`, color: "bg-purple-50 text-purple-600" },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-2xl border border-gray-200 p-4">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg mb-3 ${stat.color}`}>{stat.icon}</div>
                  <p className="text-xl font-black text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="text-base font-black text-gray-900">Recent Orders</h2>
                <Link href="/buyer/orders" className="text-xs text-emerald-600 font-semibold hover:underline">View all →</Link>
              </div>

              {loading ? (
                <div className="p-6 space-y-3">
                  {Array(3).fill(0).map((_, i) => (
                    <div key={i} className="animate-pulse flex gap-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-2xl"></div>
                      <div className="flex-1 space-y-2">
                        <div className="bg-gray-200 h-4 rounded w-1/3"></div>
                        <div className="bg-gray-200 h-3 rounded w-1/4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-2xl mb-2">📦</p>
                  <p className="text-sm font-bold text-gray-700">No orders yet</p>
                  <Link href="/browse">
                    <button className="mt-3 text-xs text-emerald-600 font-bold hover:underline">Start Shopping →</button>
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {orders.map((order) => (
                    <div key={order.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition">
                      <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-2xl shrink-0">📦</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-sm font-black text-gray-900">#TH-{order.id}</p>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${statusStyle[order.delivery_status] || "bg-gray-100 text-gray-600"}`}>
                            {order.delivery_status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400">
                          {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-black text-gray-900">₹{order.total_amount.toLocaleString()}</p>
                        <Link href="/buyer/orders">
                          <button className="text-xs text-emerald-600 font-semibold hover:underline mt-0.5">View →</button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Wishlist Preview */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="text-base font-black text-gray-900">Wishlist ❤️</h2>
                <Link href="/buyer/wishlist" className="text-xs text-emerald-600 font-semibold hover:underline">View all →</Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 divide-x divide-gray-100">
                {wishlist.map((item) => (
                  <div key={item.name} className="p-4 hover:bg-gray-50 transition cursor-pointer">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">{item.emoji}</div>
                      <div>
                        <p className="text-xs font-bold text-gray-900 leading-tight">{item.name}</p>
                        <p className="text-xs text-gray-400">@{item.seller}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-black text-emerald-700">{item.price}</p>
                        <p className="text-xs text-gray-400 line-through">{item.original}</p>
                      </div>
                      <Link href="/cart">
                        <button className="text-xs bg-emerald-600 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-emerald-700 transition">Add to Cart</button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}