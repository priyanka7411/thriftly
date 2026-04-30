"use client";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useState, useMemo } from "react";
import { useCart } from "@/context/CartContext";

const allProducts = [
  { id: 1, name: "Banarasi Silk Saree", price: 1200, original: 4500, condition: "Like New", seller: "ethnic_finds", location: "🇮🇳 Varanasi", emoji: "🥻", tag: "73% off", rating: 4.9, reviews: 38, views: 214, urgency: "🔥 Trending", stock: "2 left", category: "Ethnic Wear" },
  { id: 2, name: "Vintage Denim Jacket", price: 899, original: 2999, condition: "Good", seller: "maya_thrifts", location: "🇮🇳 Mumbai", emoji: "🧥", tag: "70% off", rating: 4.7, reviews: 21, views: 189, urgency: "⚡ Just listed", stock: null, category: "Clothing" },
  { id: 3, name: "Nike Air Max 90", price: 3500, original: 9000, condition: "Like New", seller: "sneaker_vault", location: "🇺🇸 New York", emoji: "👟", tag: "61% off", rating: 4.8, reviews: 54, views: 431, urgency: "🔥 Trending", stock: "1 left", category: "Shoes" },
  { id: 4, name: "iPhone 11 64GB", price: 14000, original: 32000, condition: "Good", seller: "techresell", location: "🇮🇳 Bangalore", emoji: "📱", tag: "56% off", rating: 4.6, reviews: 67, views: 892, urgency: "👀 High demand", stock: null, category: "Electronics" },
  { id: 5, name: "Aesthetic Desk Lamp", price: 650, original: 1800, condition: "Fair", seller: "homefinds", location: "🇮🇳 Delhi", emoji: "🪔", tag: "64% off", rating: 4.3, reviews: 12, views: 98, urgency: "⚡ Just listed", stock: null, category: "Furniture" },
  { id: 6, name: "Kurta Set XL", price: 450, original: 1200, condition: "Good", seller: "desi_closet", location: "🇮🇳 Jaipur", emoji: "👘", tag: "62% off", rating: 4.5, reviews: 29, views: 156, urgency: null, stock: "3 left", category: "Ethnic Wear" },
  { id: 7, name: "Canon DSLR 1300D", price: 18000, original: 45000, condition: "Good", seller: "gear_resell", location: "🇮🇳 Chennai", emoji: "📷", tag: "60% off", rating: 4.8, reviews: 43, views: 567, urgency: "👀 High demand", stock: "1 left", category: "Electronics" },
  { id: 8, name: "Leather Tote Bag", price: 1100, original: 3500, condition: "Like New", seller: "baghouse", location: "🇬🇧 London", emoji: "👜", tag: "68% off", rating: 4.7, reviews: 18, views: 203, urgency: null, stock: null, category: "Bags" },
  { id: 9, name: "Harry Potter Box Set", price: 550, original: 1800, condition: "Good", seller: "bookworm99", location: "🇮🇳 Pune", emoji: "📚", tag: "69% off", rating: 4.9, reviews: 91, views: 342, urgency: "🔥 Trending", stock: null, category: "Books" },
  { id: 10, name: "PS4 Controller", price: 1800, original: 4500, condition: "Like New", seller: "gamer_hub", location: "🇮🇳 Hyderabad", emoji: "🎮", tag: "60% off", rating: 4.7, reviews: 33, views: 278, urgency: "👀 High demand", stock: "2 left", category: "Gaming" },
  { id: 11, name: "Floral Kurti S/M", price: 320, original: 999, condition: "Good", seller: "desi_closet", location: "🇮🇳 Jaipur", emoji: "👗", tag: "68% off", rating: 4.4, reviews: 15, views: 112, urgency: null, stock: null, category: "Clothing" },
  { id: 12, name: "Boat Earphones", price: 399, original: 1299, condition: "Like New", seller: "techresell", location: "🇮🇳 Bangalore", emoji: "🎧", tag: "69% off", rating: 4.5, reviews: 27, views: 189, urgency: "⚡ Just listed", stock: null, category: "Electronics" },
];

const categories = ["All", "Clothing", "Ethnic Wear", "Shoes", "Electronics", "Books", "Furniture", "Gaming", "Beauty", "Bags", "Accessories"];

const conditionStyle: Record<string, string> = {
  "Like New": "bg-emerald-50 text-emerald-700 border border-emerald-200",
  "Good": "bg-blue-50 text-blue-700 border border-blue-200",
  "Fair": "bg-amber-50 text-amber-700 border border-amber-200",
};

export default function Browse() {
  const { addToCart } = useCart();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("Newest First");
  const [addedId, setAddedId] = useState<number | null>(null);

  const toggleCondition = (c: string) => {
    setSelectedConditions(prev =>
      prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]
    );
  };

  const handleAddToCart = (item: typeof allProducts[0]) => {
    addToCart({ id: item.id, name: item.name, price: item.price, original: item.original, emoji: item.emoji, seller: item.seller, condition: item.condition });
    setAddedId(item.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const filtered = useMemo(() => {
    let result = allProducts;
    if (search) result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()));
    if (selectedCategory !== "All") result = result.filter(p => p.category === selectedCategory);
    if (selectedConditions.length > 0) result = result.filter(p => selectedConditions.includes(p.condition));
    if (sortBy === "Price: Low to High") result = [...result].sort((a, b) => a.price - b.price);
    if (sortBy === "Price: High to Low") result = [...result].sort((a, b) => b.price - a.price);
    if (sortBy === "Top Rated") result = [...result].sort((a, b) => b.rating - a.rating);
    if (sortBy === "Most Popular") result = [...result].sort((a, b) => b.views - a.views);
    return result;
  }, [search, selectedCategory, selectedConditions, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />

      <div className="bg-white border-b border-gray-100 px-6 py-5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
            <Link href="/" className="hover:text-emerald-600">Home</Link>
            <span>›</span>
            <span className="text-gray-700 font-medium">Browse All</span>
          </div>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-black text-gray-900">Browse All Items</h1>
              <p className="text-sm text-gray-400 mt-0.5">Showing {filtered.length} items</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Search */}
              <input
                type="text"
                placeholder="Search items..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-emerald-500 transition w-48"
              />
              <span className="text-xs text-gray-500 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-emerald-500 bg-white font-medium text-gray-700"
              >
                {["Newest First", "Price: Low to High", "Price: High to Low", "Most Popular", "Top Rated"].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">

        {/* Sidebar */}
        <aside className="w-64 shrink-0 hidden md:block">
          <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-4">
            <h3 className="text-sm font-black text-gray-900 mb-4">Category</h3>
            <div className="space-y-2">
              {categories.map((cat) => (
                <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === cat}
                    onChange={() => setSelectedCategory(cat)}
                    className="w-4 h-4 accent-emerald-600"
                  />
                  <span className={`text-sm font-medium transition ${selectedCategory === cat ? "text-emerald-700" : "text-gray-600 group-hover:text-emerald-700"}`}>{cat}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-4">
            <h3 className="text-sm font-black text-gray-900 mb-4">Condition</h3>
            <div className="space-y-2">
              {["Like New", "Good", "Fair"].map((c) => (
                <label key={c} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedConditions.includes(c)}
                    onChange={() => toggleCondition(c)}
                    className="w-4 h-4 accent-emerald-600 rounded"
                  />
                  <span className="text-sm text-gray-600 group-hover:text-emerald-700 transition">{c}</span>
                </label>
              ))}
            </div>
          </div>

          {(selectedCategory !== "All" || selectedConditions.length > 0 || search) && (
            <button
              onClick={() => { setSelectedCategory("All"); setSelectedConditions([]); setSearch(""); }}
              className="w-full text-xs border border-red-200 text-red-500 py-2 rounded-xl font-bold hover:bg-red-50 transition"
            >
              ✕ Clear All Filters
            </button>
          )}
        </aside>

        {/* Grid */}
        <div className="flex-1">
          {/* Category Pills */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 text-xs font-semibold px-4 py-2 rounded-full border transition ${selectedCategory === cat ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-gray-600 border-gray-200 hover:border-emerald-400"}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-4xl mb-3">🔍</div>
              <p className="text-lg font-black text-gray-700">No items found</p>
              <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or search</p>
              <button onClick={() => { setSelectedCategory("All"); setSelectedConditions([]); setSearch(""); }} className="mt-4 text-sm text-emerald-600 font-bold hover:underline">
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {filtered.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl border border-gray-200 hover:border-emerald-300 hover:shadow-xl transition group overflow-hidden">
                  <Link href={`/product/${item.id}`}>
                    <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 h-44 flex items-center justify-center overflow-hidden cursor-pointer">
                      <span className="text-6xl group-hover:scale-110 transition duration-300">{item.emoji}</span>
                      <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-black px-2 py-0.5 rounded-lg">{item.tag}</span>
                      <button className="absolute top-2 left-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-300 hover:text-red-500 transition text-sm">♡</button>
                      {item.urgency && (
                        <span className="absolute bottom-2 left-2 bg-black/70 text-white text-xs font-semibold px-2 py-0.5 rounded-lg">{item.urgency}</span>
                      )}
                    </div>
                  </Link>
                  <div className="p-3">
                    <p className="text-xs text-gray-400 font-medium mb-0.5">{item.category}</p>
                    <Link href={`/product/${item.id}`}>
                      <p className="text-sm font-bold text-gray-900 leading-tight mb-1 hover:text-emerald-700 cursor-pointer">{item.name}</p>
                    </Link>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-base font-black text-emerald-700">₹{item.price.toLocaleString()}</span>
                      <span className="text-xs text-gray-400 line-through">₹{item.original.toLocaleString()}</span>
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
                    <button
                      onClick={() => handleAddToCart(item)}
                      className={`w-full text-xs py-2 rounded-xl font-bold transition mt-1 ${addedId === item.id ? "bg-emerald-700 text-white" : "bg-emerald-600 text-white hover:bg-emerald-700"}`}
                    >
                      {addedId === item.id ? "✅ Added!" : "🛒 Add to Cart"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}