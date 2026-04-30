import Navbar from "@/components/Navbar";
import Link from "next/link";

const wishlistItems = [
  { id: 7, name: "Canon DSLR 1300D", price: "₹18,000", original: "₹45,000", emoji: "📷", seller: "gear_resell", location: "🇮🇳 Chennai", condition: "Good", tag: "60% off", rating: 4.8 },
  { id: 10, name: "PS4 Controller", price: "₹1,800", original: "₹4,500", emoji: "🎮", seller: "gamer_hub", location: "🇮🇳 Hyderabad", condition: "Like New", tag: "60% off", rating: 4.7 },
  { id: 8, name: "Leather Tote Bag", price: "₹1,100", original: "₹3,500", emoji: "👜", seller: "baghouse", location: "🇬🇧 London", condition: "Like New", tag: "68% off", rating: 4.7 },
  { id: 4, name: "iPhone 11 64GB", price: "₹14,000", original: "₹32,000", emoji: "📱", seller: "techresell", location: "🇮🇳 Bangalore", condition: "Good", tag: "56% off", rating: 4.6 },
];

const sidebarLinks = [
  { icon: "📦", label: "My Orders", href: "/buyer/orders", active: false },
  { icon: "❤️", label: "Wishlist", href: "/buyer/wishlist", active: true },
  { icon: "📍", label: "Addresses", href: "/buyer/addresses", active: false },
  { icon: "💳", label: "Payments", href: "/buyer/payments", active: false },
  { icon: "⭐", label: "My Reviews", href: "/buyer/reviews", active: false },
  { icon: "🔔", label: "Notifications", href: "/buyer/notifications", active: false },
  { icon: "⚙️", label: "Settings", href: "/buyer/settings", active: false },
];

export default function Wishlist() {
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

          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-black text-gray-900">Wishlist ❤️</h1>
                <p className="text-sm text-gray-400 mt-0.5">{wishlistItems.length} saved items</p>
              </div>
              <Link href="/browse">
                <button className="text-sm font-bold text-emerald-600 hover:underline">+ Add more items</button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {wishlistItems.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl border border-gray-200 p-4 hover:border-emerald-200 hover:shadow-md transition">
                  <div className="flex gap-4">
                    <Link href={`/product/${item.id}`}>
                      <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center text-4xl shrink-0 cursor-pointer hover:shadow-md transition">{item.emoji}</div>
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <Link href={`/product/${item.id}`}>
                          <p className="text-sm font-black text-gray-900 hover:text-emerald-700 transition">{item.name}</p>
                        </Link>
                        <button className="text-red-400 hover:text-red-600 transition text-lg ml-2">♥</button>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">@{item.seller} · {item.location}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-black text-emerald-700">{item.price}</span>
                        <span className="text-xs text-gray-400 line-through">{item.original}</span>
                        <span className="text-xs bg-red-50 text-red-600 font-bold px-1.5 py-0.5 rounded-md">{item.tag}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Link href="/cart" className="flex-1">
                          <button className="w-full text-xs bg-emerald-600 text-white py-2 rounded-xl font-bold hover:bg-emerald-700 transition">Add to Cart</button>
                        </Link>
                        <Link href={`/product/${item.id}`} className="flex-1">
                          <button className="w-full text-xs border border-gray-200 text-gray-600 py-2 rounded-xl font-bold hover:border-emerald-400 transition">View</button>
                        </Link>
                      </div>
                    </div>
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