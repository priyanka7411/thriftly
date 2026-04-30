import Navbar from "@/components/Navbar";
import Link from "next/link";

const sidebarLinks = [
  { icon: "📊", label: "Overview", href: "/seller", active: false },
  { icon: "📦", label: "My Listings", href: "/seller/listings", active: false },
  { icon: "🛒", label: "Orders", href: "/seller/orders", active: false },
  { icon: "💰", label: "Earnings", href: "/seller/earnings", active: false },
  { icon: "⭐", label: "Reviews", href: "/seller/reviews", active: false },
  { icon: "👤", label: "Public Profile", href: "/seller/profile", active: true },
  { icon: "⚙️", label: "Settings", href: "/seller/settings", active: false },
];

export default function SellerProfile() {
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

        <div className="flex-1">
          <h1 className="text-2xl font-black text-gray-900 mb-6">Public Profile 👤</h1>
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center mb-6">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-700 rounded-3xl flex items-center justify-center text-4xl font-black mx-auto mb-4">E</div>
            <h2 className="text-xl font-black text-gray-900">Ethnic Finds Store</h2>
            <p className="text-sm text-gray-400 mt-1">@ethnic_finds · 🇮🇳 Varanasi, India</p>
            <p className="text-sm text-gray-600 mt-3 max-w-md mx-auto">Premium handwoven ethnic wear from Varanasi. Authentic, affordable, sustainable.</p>
            <div className="flex justify-center gap-8 mt-6 pt-6 border-t border-gray-100">
              {[["4.9★", "Rating"], ["134", "Sales"], ["5", "Listings"], ["1yr+", "Member"]].map(([val, label]) => (
                <div key={label} className="text-center">
                  <p className="text-lg font-black text-gray-900">{val}</p>
                  <p className="text-xs text-gray-400">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-black text-gray-900">Active Listings</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
              {[
                { name: "Banarasi Silk Saree", price: "₹1,200", emoji: "🥻", id: 1 },
                { name: "Vintage Denim Jacket", price: "₹899", emoji: "🧥", id: 2 },
                { name: "Floral Kurti Set", price: "₹320", emoji: "👗", id: 4 },
              ].map(item => (
                <Link href={`/product/${item.id}`} key={item.id}>
                  <div className="border border-gray-200 rounded-2xl p-3 hover:border-emerald-300 hover:shadow-md transition cursor-pointer">
                    <div className="text-4xl text-center mb-2">{item.emoji}</div>
                    <p className="text-xs font-bold text-gray-900 text-center">{item.name}</p>
                    <p className="text-sm font-black text-emerald-700 text-center mt-1">{item.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}