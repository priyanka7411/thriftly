"use client";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabase";

interface Product {
  id: number;
  name: string;
  price: number;
  original_price: number;
  condition: string;
  category: string;
  images: string[];
  location: string;
  status: string;
  views: number;
  description: string;
}

const categories = ["All", "Clothing", "Ethnic Wear", "Shoes", "Electronics", "Books", "Furniture", "Gaming", "Beauty", "Bags", "Accessories"];

const conditionStyle: Record<string, string> = {
  "Like New": "bg-emerald-50 text-emerald-700 border border-emerald-200",
  "Good": "bg-blue-50 text-blue-700 border border-blue-200",
  "Fair": "bg-amber-50 text-amber-700 border border-amber-200",
};

const discountPercent = (price: number, original: number) =>
  Math.round(((original - price) / original) * 100);

export default function Browse() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("Newest First");
  const [addedId, setAddedId] = useState<number | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("status", "active");

    if (!error && data) setProducts(data);
    setLoading(false);
  };

  const toggleCondition = (c: string) => {
    setSelectedConditions(prev =>
      prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]
    );
  };

  const handleAddToCart = (item: Product) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      original: item.original_price,
      emoji: item.images?.[0] || "🛍️",
      seller: "seller",
      condition: item.condition,
    });
    setAddedId(item.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const filtered = useMemo(() => {
    let result = products;
    if (search) result = result.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
    );
    if (selectedCategory !== "All") result = result.filter(p => p.category === selectedCategory);
    if (selectedConditions.length > 0) result = result.filter(p => selectedConditions.includes(p.condition));
    if (sortBy === "Price: Low to High") result = [...result].sort((a, b) => a.price - b.price);
    if (sortBy === "Price: High to Low") result = [...result].sort((a, b) => b.price - a.price);
    if (sortBy === "Most Popular") result = [...result].sort((a, b) => b.views - a.views);
    return result;
  }, [products, search, selectedCategory, selectedConditions, sortBy]);

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
              <p className="text-sm text-gray-400 mt-0.5">
                {loading ? "Loading..." : `Showing ${filtered.length} items`}
              </p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
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
                className="text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-emerald-500 bg-white"
              >
                {["Newest First", "Price: Low to High", "Price: High to Low", "Most Popular"].map(s => (
                  <option key={s}>{s}</option>
                ))}
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

        {/* Products Grid */}
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

          {/* Loading */}
          {loading && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-200 overflow-hidden animate-pulse">
                  <div className="bg-gray-100 h-44"></div>
                  <div className="p-3 space-y-2">
                    <div className="bg-gray-100 h-3 rounded w-3/4"></div>
                    <div className="bg-gray-100 h-3 rounded w-1/2"></div>
                    <div className="bg-gray-100 h-3 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty */}
          {!loading && filtered.length === 0 && (
            <div className="text-center py-20">
              <div className="text-4xl mb-3">🔍</div>
              <p className="text-lg font-black text-gray-700">No items found</p>
              <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
              <button
                onClick={() => { setSelectedCategory("All"); setSelectedConditions([]); setSearch(""); }}
                className="mt-4 text-sm text-emerald-600 font-bold hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}

          {/* Grid */}
          {!loading && filtered.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {filtered.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl border border-gray-200 hover:border-emerald-300 hover:shadow-xl transition group overflow-hidden">
                  <Link href={`/product/${item.id}`}>
                    <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 h-44 flex items-center justify-center overflow-hidden cursor-pointer">
                      <span className="text-6xl group-hover:scale-110 transition duration-300">
                        {item.images?.[0] || "🛍️"}
                      </span>
                      <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-black px-2 py-0.5 rounded-lg">
                        {discountPercent(item.price, item.original_price)}% off
                      </span>
                      <button className="absolute top-2 left-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-300 hover:text-red-500 transition text-sm">♡</button>
                    </div>
                  </Link>

                  <div className="p-3">
                    <p className="text-xs text-gray-400 font-medium mb-0.5">{item.category}</p>
                    <Link href={`/product/${item.id}`}>
                      <p className="text-sm font-bold text-gray-900 leading-tight mb-1 hover:text-emerald-700 cursor-pointer">{item.name}</p>
                    </Link>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-base font-black text-emerald-700">₹{item.price.toLocaleString()}</span>
                      <span className="text-xs text-gray-400 line-through">₹{item.original_price.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${conditionStyle[item.condition] || "bg-gray-100 text-gray-600"}`}>
                        {item.condition}
                      </span>
                      <span className="text-xs text-gray-400">{item.location}</span>
                    </div>
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