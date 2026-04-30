import Navbar from "@/components/Navbar";
import Link from "next/link";


const listings = [
  { id: 1, name: "Banarasi Silk Saree", price: "₹1,200", status: "Active", views: 214, emoji: "🥻", category: "Ethnic Wear", listed: "2 days ago" },
  { id: 2, name: "Vintage Denim Jacket", price: "₹899", status: "Active", views: 189, emoji: "🧥", category: "Clothing", listed: "5 days ago" },
  { id: 3, name: "Wooden Study Table", price: "₹2,500", status: "Sold", views: 312, emoji: "🪑", category: "Furniture", listed: "2 weeks ago" },
  { id: 4, name: "Floral Kurti Set", price: "₹320", status: "Active", views: 112, emoji: "👗", category: "Clothing", listed: "1 week ago" },
  { id: 5, name: "Old NCERT Books Set", price: "₹250", status: "Inactive", views: 45, emoji: "📚", category: "Books", listed: "3 weeks ago" },
];

const orders = [
  { id: "#TH-2025-48291", buyer: "Priyanka M.", item: "Banarasi Silk Saree", emoji: "🥻", amount: "₹1,200", status: "Processing", date: "Apr 26" },
  { id: "#TH-2025-41823", buyer: "Rahul S.", item: "Vintage Denim Jacket", emoji: "🧥", amount: "₹899", status: "Shipped", date: "Apr 18" },
  { id: "#TH-2025-39012", buyer: "Meera K.", item: "Wooden Study Table", emoji: "🪑", amount: "₹2,500", status: "Delivered", date: "Apr 5" },
  { id: "#TH-2025-31456", buyer: "Arjun T.", item: "Floral Kurti Set", emoji: "👗", amount: "₹320", status: "Delivered", date: "Mar 28" },
];

const statusStyle: Record<string, string> = {
  Active: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Sold: "bg-gray-100 text-gray-500 border border-gray-200",
  Inactive: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  Processing: "bg-blue-50 text-blue-700 border border-blue-200",
  Shipped: "bg-orange-50 text-orange-700 border border-orange-200",
  Delivered: "bg-emerald-50 text-emerald-700 border border-emerald-200",
};

export default function SellerDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">

        {/* ✅ Navbar added properly */}
        <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Seller Dashboard 💼</h1>
            <p className="text-sm text-gray-400 mt-0.5">Welcome back, Ethnic Finds Store!</p>
          </div>
          <Link href="/seller/listings">
  <button className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 transition">
    + List New Item
  </button>
</Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar */}
          <aside className="w-full lg:w-60 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-4 text-center">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center text-2xl font-black mx-auto mb-3">E</div>
              <p className="text-sm font-black text-gray-900">Ethnic Finds Store</p>
              <p className="text-xs text-gray-400">@ethnic_finds</p>
              <p className="text-xs text-gray-400 mt-0.5">🇮🇳 Varanasi, India</p>
              <div className="flex justify-center gap-1 mt-2">
                {[1,2,3,4,5].map(i => <span key={i} className="text-amber-400 text-xs">★</span>)}
              </div>
              <p className="text-xs text-gray-400 mt-0.5">4.9 · 134 sales</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              {[
  { icon: "📊", label: "Overview", active: true, href: "/seller" },
  { icon: "📦", label: "My Listings", active: false, href: "/seller/listings" },
  { icon: "🛒", label: "Orders", active: false, href: "/seller/orders" },
  { icon: "💰", label: "Earnings", active: false, href: "/seller/earnings" },
  { icon: "⭐", label: "Reviews", active: false, href: "/seller/reviews" },
  { icon: "👤", label: "Public Profile", active: false, href: "/seller/profile" },
  { icon: "⚙️", label: "Settings", active: false, href: "/seller/settings" },
].map((item) => (
  <Link href={item.href} key={item.label}>
    <div className={`flex items-center gap-3 px-4 py-3.5 cursor-pointer transition border-l-4 ${item.active ? "bg-emerald-50 border-emerald-500" : "border-transparent hover:bg-gray-50"}`}>
      <span className="text-base">{item.icon}</span>
      <span className={`text-sm font-semibold ${item.active ? "text-emerald-700" : "text-gray-700"}`}>{item.label}</span>
    </div>
  </Link>
))}
              <div className="border-t border-gray-100">
                <div className="flex items-center gap-3 px-4 py-3.5 cursor-pointer hover:bg-red-50 transition">
                  <span>🚪</span>
                  <span className="text-sm font-semibold text-red-500">Logout</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main */}
          <div className="flex-1 space-y-6">

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: "📦", label: "Active Listings", value: "3", sub: "+1 this week", color: "bg-blue-50 text-blue-600" },
                { icon: "🛒", label: "Total Orders", value: "134", sub: "+4 this month", color: "bg-emerald-50 text-emerald-600" },
                { icon: "💰", label: "Total Earnings", value: "₹58,200", sub: "Lifetime", color: "bg-purple-50 text-purple-600" },
                { icon: "⭐", label: "Seller Rating", value: "4.9", sub: "38 reviews", color: "bg-amber-50 text-amber-600" },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-2xl border border-gray-200 p-4">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg mb-3 ${stat.color}`}>{stat.icon}</div>
                  <p className="text-xl font-black text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">{stat.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{stat.sub}</p>
                </div>
              ))}
            </div>

            {/* Earnings Chart placeholder */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-black text-gray-900">Earnings Overview</h2>
                <select className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:border-emerald-500 bg-white text-gray-600">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 3 months</option>
                </select>
              </div>
              {/* Bar chart visual */}
              <div className="flex items-end gap-2 h-24">
                {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full bg-emerald-100 rounded-t-lg hover:bg-emerald-400 transition cursor-pointer" style={{ height: `${h}%` }}></div>
                    <span className="text-xs text-gray-400">{["M","T","W","T","F","S","S"][i]}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-400">This week</p>
                  <p className="text-lg font-black text-gray-900">₹4,850</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">vs last week</p>
                  <p className="text-sm font-bold text-emerald-600">↑ +23%</p>
                </div>
              </div>
            </div>

            {/* Listings */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="text-base font-black text-gray-900">My Listings</h2>
                <button className="text-xs bg-emerald-600 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-emerald-700 transition">+ Add New</button>
              </div>
              <div className="divide-y divide-gray-100">
                {listings.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition">
                    <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-2xl shrink-0">{item.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-400">{item.category} · Listed {item.listed} · 👁 {item.views} views</p>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${statusStyle[item.status]}`}>{item.status}</span>
                    <p className="text-sm font-black text-emerald-700 shrink-0">{item.price}</p>
                    <div className="flex gap-1 shrink-0">
                      <button className="text-xs border border-gray-200 text-gray-600 px-2.5 py-1 rounded-lg hover:border-emerald-400 hover:text-emerald-700 transition font-medium">Edit</button>
                      <button className="text-xs border border-red-100 text-red-400 px-2.5 py-1 rounded-lg hover:bg-red-50 transition font-medium">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="text-base font-black text-gray-900">Recent Orders</h2>
                <Link href="/seller/orders" className="text-xs text-emerald-600 font-semibold hover:underline">View all →</Link>
              </div>
              <div className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <div key={order.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-xl shrink-0">{order.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900">{order.item}</p>
                      <p className="text-xs text-gray-400">Buyer: {order.buyer} · {order.date}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${statusStyle[order.status]}`}>{order.status}</span>
                    <p className="text-sm font-black text-emerald-700 shrink-0">{order.amount}</p>
                    <Link href="/seller/orders" className="text-xs text-emerald-600 font-semibold hover:underline shrink-0">Manage →</Link>
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