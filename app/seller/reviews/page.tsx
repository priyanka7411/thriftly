import Navbar from "@/components/Navbar";
import Link from "next/link";

const sidebarLinks = [
  { icon: "📊", label: "Overview", href: "/seller", active: false },
  { icon: "📦", label: "My Listings", href: "/seller/listings", active: false },
  { icon: "🛒", label: "Orders", href: "/seller/orders", active: false },
  { icon: "💰", label: "Earnings", href: "/seller/earnings", active: false },
  { icon: "⭐", label: "Reviews", href: "/seller/reviews", active: true },
  { icon: "👤", label: "Public Profile", href: "/seller/profile", active: false },
  { icon: "⚙️", label: "Settings", href: "/seller/settings", active: false },
];

const reviews = [
  { buyer: "Priyanka M.", avatar: "P", rating: 5, item: "Banarasi Silk Saree", emoji: "🥻", date: "Apr 27", text: "Absolutely gorgeous saree! Exactly as described. Fast shipping!" },
  { buyer: "Rahul S.", avatar: "R", rating: 5, item: "Vintage Denim Jacket", emoji: "🧥", date: "Apr 20", text: "Great condition, exactly as pictured. Will buy again!" },
  { buyer: "Meera K.", avatar: "M", rating: 4, item: "Wooden Study Table", emoji: "🪑", date: "Apr 8", text: "Good quality, slight delay in shipping but overall satisfied." },
  { buyer: "Arjun T.", avatar: "A", rating: 5, item: "Floral Kurti Set", emoji: "👗", date: "Mar 30", text: "My wife loved it! Perfect condition and great price." },
];

export default function SellerReviews() {
  const avg = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);

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
          <h1 className="text-2xl font-black text-gray-900 mb-6">Reviews ⭐</h1>

          {/* Summary */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 flex items-center gap-8">
            <div className="text-center">
              <p className="text-5xl font-black text-gray-900">{avg}</p>
              <div className="flex gap-0.5 justify-center mt-1">
                {Array(5).fill(0).map((_, i) => <span key={i} className="text-amber-400">★</span>)}
              </div>
              <p className="text-xs text-gray-400 mt-1">{reviews.length} reviews</p>
            </div>
            <div className="flex-1 space-y-2">
              {[5, 4, 3, 2, 1].map(star => {
                const count = reviews.filter(r => r.rating === star).length;
                const pct = (count / reviews.length) * 100;
                return (
                  <div key={star} className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 w-4">{star}★</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2">
                      <div className="bg-amber-400 h-2 rounded-full" style={{ width: `${pct}%` }}></div>
                    </div>
                    <span className="text-xs text-gray-400 w-4">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            {reviews.map((r, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 p-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-sm font-black shrink-0">{r.avatar}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-black text-gray-900">{r.buyer}</p>
                        <div className="flex gap-0.5">
                          {Array(r.rating).fill(0).map((_, i) => <span key={i} className="text-amber-400 text-xs">★</span>)}
                        </div>
                      </div>
                      <p className="text-xs text-gray-400">{r.date}</p>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm">{r.emoji}</span>
                      <p className="text-xs text-gray-500 font-medium">{r.item}</p>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{r.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}