"use client";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useRouter } from "next/navigation";

const categories = [
  { icon: "👗", name: "Clothing", count: "2.4k" },
  { icon: "🥻", name: "Ethnic Wear", count: "1.1k" },
  { icon: "👟", name: "Shoes", count: "980" },
  { icon: "📱", name: "Electronics", count: "3.2k" },
  { icon: "📚", name: "Books", count: "5.6k" },
  { icon: "🛋️", name: "Furniture", count: "430" },
  { icon: "🎮", name: "Gaming", count: "760" },
  { icon: "💄", name: "Beauty", count: "1.8k" },
  { icon: "🎒", name: "Bags", count: "640" },
  { icon: "🧣", name: "Accessories", count: "920" },
];

const products = [
  { id: 1, name: "Banarasi Silk Saree", price: "₹1,200", original: "₹4,500", condition: "Like New", seller: "ethnic_finds", location: "🇮🇳 Varanasi", emoji: "🥻", tag: "73% off", rating: 4.9, reviews: 38, views: 214, urgency: "🔥 Trending", stock: "2 left" },
  { id: 2, name: "Vintage Denim Jacket", price: "₹899", original: "₹2,999", condition: "Good", seller: "maya_thrifts", location: "🇮🇳 Mumbai", emoji: "🧥", tag: "70% off", rating: 4.7, reviews: 21, views: 189, urgency: "⚡ Just listed", stock: null },
  { id: 3, name: "Nike Air Max 90", price: "₹3,500", original: "₹9,000", condition: "Like New", seller: "sneaker_vault", location: "🇺🇸 New York", emoji: "👟", tag: "61% off", rating: 4.8, reviews: 54, views: 431, urgency: "🔥 Trending", stock: "1 left" },
  { id: 4, name: "iPhone 11 64GB", price: "₹14,000", original: "₹32,000", condition: "Good", seller: "techresell", location: "🇮🇳 Bangalore", emoji: "📱", tag: "56% off", rating: 4.6, reviews: 67, views: 892, urgency: "👀 High demand", stock: null },
  { id: 5, name: "Aesthetic Desk Lamp", price: "₹650", original: "₹1,800", condition: "Fair", seller: "homefinds", location: "🇮🇳 Delhi", emoji: "🪔", tag: "64% off", rating: 4.3, reviews: 12, views: 98, urgency: "⚡ Just listed", stock: null },
  { id: 6, name: "Kurta Set XL", price: "₹450", original: "₹1,200", condition: "Good", seller: "desi_closet", location: "🇮🇳 Jaipur", emoji: "👘", tag: "62% off", rating: 4.5, reviews: 29, views: 156, urgency: null, stock: "3 left" },
  { id: 7, name: "Canon DSLR 1300D", price: "₹18,000", original: "₹45,000", condition: "Good", seller: "gear_resell", location: "🇮🇳 Chennai", emoji: "📷", tag: "60% off", rating: 4.8, reviews: 43, views: 567, urgency: "👀 High demand", stock: "1 left" },
  { id: 8, name: "Leather Tote Bag", price: "₹1,100", original: "₹3,500", condition: "Like New", seller: "baghouse", location: "🇬🇧 London", emoji: "👜", tag: "68% off", rating: 4.7, reviews: 18, views: 203, urgency: null, stock: null },
];

const conditionStyle: Record<string, string> = {
  "Like New": "bg-emerald-50 text-emerald-700 border border-emerald-200",
  "Good": "bg-blue-50 text-blue-700 border border-blue-200",
  "Fair": "bg-amber-50 text-amber-700 border border-amber-200",
};

const testimonials = [
  { name: "Riya Sharma", role: "Buyer · Mumbai", text: "Found a branded jacket for ₹800. Couldn't believe it was real!", avatar: "R", rating: 5 },
  { name: "Arjun Mehta", role: "Seller · Bangalore", text: "Sold my old MacBook in 3 days. Process was smooth and payout was fast.", avatar: "A", rating: 5 },
  { name: "Priya Nair", role: "Buyer · Kerala", text: "The ethnic wear collection is incredible. Got a silk saree at 70% off!", avatar: "P", rating: 5 },
];

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />

      {/* Hero */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full mb-5 border border-emerald-200">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              247 people browsing right now
            </div>
            <h1 className="text-5xl font-black text-gray-900 leading-[1.1] mb-3 tracking-tight">
              Don't buy new <br />
              <span className="text-emerald-600">when pre-loved wins.</span>
            </h1>
            <p className="text-gray-500 text-base leading-relaxed mb-6 max-w-md">
              India's #1 global thrift marketplace. Save up to <span className="font-bold text-gray-700">80% off</span> on fashion, electronics, books & more — from verified sellers worldwide.
            </p>
            <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-xl px-4 py-2.5 mb-6 max-w-sm">
              <span className="text-orange-500 text-sm">⏳</span>
              <p className="text-xs text-orange-700 font-semibold">34 items sold in the last hour — don't miss out!</p>
            </div>
            <div className="flex gap-3 mb-8 flex-wrap">
              <Link href="/browse">
                <button className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition shadow-sm">
                  🛍️ Shop Now — It's Free
                </button>
              </Link>
              <Link href="/seller">
                <button className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-800 rounded-xl text-sm font-bold hover:bg-gray-200 transition">
                  💼 Sell an Item
                </button>
              </Link>
            </div>
            <div className="flex gap-8 pt-6 border-t border-gray-100">
              {[["10K+", "Products Listed"], ["5K+", "Verified Sellers"], ["50+", "Countries"], ["4.8★", "Avg Rating"]].map(([num, label]) => (
                <div key={label}>
                  <p className="text-xl font-black text-gray-900">{num}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Cards */}
          <div className="flex-1 grid grid-cols-2 gap-3 max-w-md w-full">
            {products.slice(0, 4).map((item, i) => (
              <Link href={`/product/${item.id}`} key={item.id}>
                <div className={`bg-gray-50 rounded-2xl p-4 border border-gray-100 hover:border-emerald-300 hover:shadow-md transition cursor-pointer ${i % 2 !== 0 ? "mt-5" : ""}`}>
                  <div className="text-4xl mb-3 text-center">{item.emoji}</div>
                  <p className="text-xs font-bold text-gray-800 leading-tight mb-1">{item.name}</p>
                  <p className="text-emerald-700 font-black text-sm">{item.price}</p>
                  <p className="text-gray-400 line-through text-xs">{item.original}</p>
                  <span className="inline-block mt-1 text-xs bg-red-50 text-red-600 font-bold px-1.5 py-0.5 rounded-md">{item.tag}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <div className="bg-white border-b border-gray-100 py-3">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-8">
          {[["✅", "Verified Sellers"], ["🔒", "Secure Payments"], ["🚚", "Worldwide Shipping"], ["↩️", "Easy Returns"], ["💬", "Buyer Protection"]].map(([icon, text]) => (
            <div key={text} className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
              <span>{icon}</span><span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Categories */}
        <section className="mb-12">
          <div className="flex items-end justify-between mb-5">
            <div>
              <h2 className="text-xl font-black text-gray-900">Shop by Category</h2>
              <p className="text-sm text-gray-400 mt-0.5">From ethnic wear to global gadgets</p>
            </div>
            <Link href="/browse" className="text-sm font-semibold text-emerald-600 hover:underline">View all →</Link>
          </div>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => router.push(`/browse?category=${cat.name}`)}
                className="group flex flex-col items-center gap-1.5 bg-white rounded-2xl py-4 px-2 border border-gray-200 hover:border-emerald-400 hover:shadow-md transition cursor-pointer"
              >
                <span className="text-2xl group-hover:scale-110 transition">{cat.icon}</span>
                <span className="text-xs font-bold text-gray-700 text-center leading-tight">{cat.name}</span>
                <span className="text-xs text-gray-400">{cat.count}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Products */}
        <section className="mb-12">
          <div className="flex items-end justify-between mb-5">
            <div>
              <h2 className="text-xl font-black text-gray-900">New Arrivals 🔥</h2>
              <p className="text-sm text-gray-400 mt-0.5">Fresh drops from verified sellers worldwide</p>
            </div>
            <Link href="/browse" className="text-sm font-semibold text-emerald-600 hover:underline">View all →</Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border border-gray-200 hover:border-emerald-300 hover:shadow-xl transition cursor-pointer group overflow-hidden">
                <Link href={`/product/${item.id}`}>
                  <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 h-44 flex items-center justify-center overflow-hidden">
                    <span className="text-6xl group-hover:scale-110 transition duration-300">{item.emoji}</span>
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-black px-2 py-0.5 rounded-lg">{item.tag}</span>
                    <button className="absolute top-2 left-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-300 hover:text-red-500 transition text-sm">♡</button>
                    {item.urgency && (
                      <span className="absolute bottom-2 left-2 bg-black/70 text-white text-xs font-semibold px-2 py-0.5 rounded-lg">{item.urgency}</span>
                    )}
                  </div>
                </Link>
                <div className="p-3">
                  <Link href={`/product/${item.id}`}>
                    <p className="text-sm font-bold text-gray-900 leading-tight mb-1 hover:text-emerald-700">{item.name}</p>
                  </Link>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-base font-black text-emerald-700">{item.price}</span>
                    <span className="text-xs text-gray-400 line-through">{item.original}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-amber-500 font-bold">★ {item.rating}</span>
                    <span className="text-xs text-gray-400">({item.reviews})</span>
                    <span className="text-xs text-gray-300">·</span>
                    <span className="text-xs text-gray-400">👁 {item.views}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${conditionStyle[item.condition]}`}>{item.condition}</span>
                    <span className="text-xs text-gray-400">{item.location}</span>
                  </div>
                  {item.stock && <div className="text-xs text-red-500 font-semibold mb-2">⚠️ Only {item.stock}!</div>}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <span className="text-xs text-gray-500">@{item.seller}</span>
                    <Link href={`/product/${item.id}`}>
                      <span className="text-xs font-bold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg hover:bg-emerald-100 transition">View →</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/browse">
              <button className="px-8 py-3 border-2 border-emerald-600 text-emerald-700 font-bold text-sm rounded-xl hover:bg-emerald-50 transition">
                Load More Products →
              </button>
            </Link>
          </div>
        </section>

        {/* Sell Banner */}
        <section className="bg-emerald-600 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div className="text-white">
            <h2 className="text-2xl font-black mb-1">Turn clutter into cash 💸</h2>
            <p className="text-emerald-100 text-sm">List your pre-loved items in under 2 minutes. Join 5,000+ sellers. It's completely free!</p>
          </div>
          <Link href="/seller">
            <button className="shrink-0 px-6 py-3 bg-white text-emerald-700 font-black text-sm rounded-xl hover:bg-emerald-50 transition">
              Start Selling Today →
            </button>
          </Link>
        </section>

        {/* Testimonials */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-xl font-black text-gray-900">Loved by buyers & sellers 💚</h2>
            <p className="text-sm text-gray-400 mt-1">Real reviews from real people</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl border border-gray-200 hover:shadow-md transition p-5">
                <div className="flex gap-0.5 mb-3">
                  {Array(t.rating).fill(0).map((_, i) => <span key={i} className="text-amber-400 text-sm">★</span>)}
                </div>
                <p className="text-sm text-gray-700 mb-4 leading-relaxed italic">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                  <div className="w-9 h-9 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-sm font-black">{t.avatar}</div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 bg-emerald-600 rounded-lg flex items-center justify-center text-white text-xs font-black">T</div>
                <span className="text-lg font-black text-gray-900">Thriftly</span>
              </div>
              <p className="text-xs text-gray-400 max-w-xs leading-relaxed mb-3">India's global thrift marketplace. Buy & sell pre-loved items sustainably.</p>
              <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5 w-fit">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                <span className="text-xs text-emerald-700 font-semibold">247 people online now</span>
              </div>
            </div>
            {[
              { title: "Shop", links: [{ label: "Browse All", href: "/browse" }, { label: "New Arrivals", href: "/browse" }, { label: "Trending", href: "/browse" }, { label: "Categories", href: "/browse" }] },
              { title: "Sell", links: [{ label: "Become a Seller", href: "/seller" }, { label: "Seller Dashboard", href: "/seller" }, { label: "How it works", href: "/how-it-works" }, { label: "Guidelines", href: "/how-it-works" }] },
              { title: "Support", links: [{ label: "Help Center", href: "/how-it-works" }, { label: "Buyer Protection", href: "/how-it-works" }, { label: "Contact Us", href: "/how-it-works" }, { label: "About", href: "/how-it-works" }] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-sm font-black text-gray-900 mb-3">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link href={l.href} className="text-xs text-gray-400 hover:text-emerald-700 transition">{l.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 pt-6 flex flex-col md:flex-row justify-between items-center gap-2">
            <p className="text-xs text-gray-400">© 2026 Thriftly. Made with ❤️ in India 🇮🇳 for the World 🌍</p>
            <div className="flex gap-4">
              <Link href="/privacy" className="text-xs text-gray-400 hover:text-emerald-700">Privacy Policy</Link>
<Link href="/terms" className="text-xs text-gray-400 hover:text-emerald-700">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}