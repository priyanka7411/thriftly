"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import { ArrowRight, ShoppingBag, Tag, Shield, Truck, RefreshCw, Star, TrendingUp, Zap, Users, Package, Globe } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Product {
  id: number;
  name: string;
  price: number;
  original_price: number;
  condition: string;
  category: string;
  images: string[];
  location: string;
  views: number;
  created_at: string;
}

interface Category {
  name: string;
  slug: string;
  image: string;
  count: string;
  color: string;
}

interface Testimonial {
  name: string;
  role: string;
  text: string;
  avatar: string;
  rating: number;
  verified: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES: Category[] = [
  { name: "Clothing", slug: "Clothing", image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&q=80", count: "2.4k", color: "from-rose-100 to-pink-50" },
  { name: "Ethnic Wear", slug: "Ethnic Wear", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=200&q=80", count: "1.1k", color: "from-orange-100 to-amber-50" },
  { name: "Shoes", slug: "Shoes", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80", count: "980", color: "from-blue-100 to-indigo-50" },
  { name: "Electronics", slug: "Electronics", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=200&q=80", count: "3.2k", color: "from-slate-100 to-gray-50" },
  { name: "Books", slug: "Books", image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=200&q=80", count: "5.6k", color: "from-yellow-100 to-amber-50" },
  { name: "Furniture", slug: "Furniture", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&q=80", count: "430", color: "from-emerald-100 to-green-50" },
  { name: "Gaming", slug: "Gaming", image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=200&q=80", count: "760", color: "from-violet-100 to-purple-50" },
  { name: "Beauty", slug: "Beauty", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&q=80", count: "1.8k", color: "from-fuchsia-100 to-pink-50" },
  { name: "Bags", slug: "Bags", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200&q=80", count: "640", color: "from-teal-100 to-cyan-50" },
  { name: "Accessories", slug: "Accessories", image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=200&q=80", count: "920", color: "from-lime-100 to-green-50" },
];

const TESTIMONIALS: Testimonial[] = [
  { name: "Riya Sharma", role: "Buyer · Mumbai", text: "Found a branded jacket for ₹800. The quality was exactly as described. Thriftly is now my go-to for fashion finds!", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80", rating: 5, verified: true },
  { name: "Arjun Mehta", role: "Seller · Bangalore", text: "Sold my MacBook in 3 days. The seller dashboard is intuitive and payouts are fast. Highly recommend!", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80", rating: 5, verified: true },
  { name: "Priya Nair", role: "Buyer · Kerala", text: "The ethnic wear collection is incredible. Got a silk saree at 70% off — authentic and beautiful!", avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&q=80", rating: 5, verified: true },
];

const TRUST_BADGES = [
  { icon: Shield, label: "Buyer Protected", desc: "100% refund guarantee" },
  { icon: Truck, label: "Fast Shipping", desc: "Ships in 2-3 days" },
  { icon: RefreshCw, label: "Easy Returns", desc: "7-day return policy" },
  { icon: Star, label: "Verified Sellers", desc: "All sellers vetted" },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Browse & Discover", desc: "Search through thousands of pre-loved items from verified sellers.", icon: ShoppingBag, color: "bg-emerald-50 text-emerald-600" },
  { step: "02", title: "Buy Securely", desc: "Pay safely with Stripe. Every transaction is protected.", icon: Shield, color: "bg-blue-50 text-blue-600" },
  { step: "03", title: "Get Delivered", desc: "Track your order in real-time from our buyer dashboard.", icon: Truck, color: "bg-orange-50 text-orange-600" },
];

// ─── Helper: Discount % ───────────────────────────────────────────────────────
const discountPercent = (price: number, original: number) =>
  original > price ? Math.round(((original - price) / original) * 100) : 0;

// ─── Product Image Component ──────────────────────────────────────────────────
function ProductImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const isUrl = src?.startsWith("http");
  if (isUrl) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
      </div>
    );
  }
  return (
    <div className={`flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 ${className}`}>
      <span className="text-5xl">{src || "🛍️"}</span>
    </div>
  );
}

// ─── Skeleton Components ──────────────────────────────────────────────────────
function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
      <div className="bg-gray-100 h-52" />
      <div className="p-4 space-y-2.5">
        <div className="h-3.5 bg-gray-100 rounded-full w-3/4" />
        <div className="h-3 bg-gray-100 rounded-full w-1/2" />
        <div className="flex justify-between">
          <div className="h-4 bg-gray-100 rounded-full w-1/3" />
          <div className="h-4 bg-gray-100 rounded-full w-1/4" />
        </div>
      </div>
    </div>
  );
}

// ─── Product Card Component ───────────────────────────────────────────────────
function ProductCard({ item }: { item: Product }) {
  const discount = discountPercent(item.price, item.original_price);
  const imageUrl = item.images?.[0]?.startsWith("http") ? item.images[0] : null;

  return (
    <Link href={`/product/${item.id}`}>
      <div className="group bg-white rounded-2xl border border-gray-100 hover:border-emerald-200 hover:shadow-xl shadow-sm transition-all duration-300 cursor-pointer overflow-hidden">
        {/* Image */}
        <div className="relative h-52 overflow-hidden bg-gray-50">
          {imageUrl ? (
  <Image
    src={imageUrl}
    alt={item.name}
    fill
    className="object-cover group-hover:scale-105 transition-transform duration-500"
    sizes="(max-width: 768px) 50vw, 25vw"
  />
) : (
  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
    {item.images?.[0] && !item.images[0].startsWith("http") ? (
      <span className="text-5xl">{item.images[0]}</span>
    ) : (
      <Package className="w-12 h-12 text-gray-300" />
    )}
  </div>
)}
          {/* Badges */}
          {discount > 0 && (
            <div className="absolute top-3 right-3">
              <span className="bg-red-500 text-white text-xs font-black px-2.5 py-1 rounded-xl shadow-sm">
                -{discount}%
              </span>
            </div>
          )}
          <button
            onClick={(e) => { e.preventDefault(); }}
            className="absolute top-3 left-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-red-50 hover:text-red-500 transition-all text-gray-400 opacity-0 group-hover:opacity-100"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          {/* Condition */}
          <div className="absolute bottom-3 left-3">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm ${
              item.condition === "Like New" ? "bg-emerald-500/90 text-white" :
              item.condition === "Good" ? "bg-blue-500/90 text-white" :
              "bg-amber-500/90 text-white"
            }`}>
              {item.condition}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs text-gray-400 font-medium mb-1">{item.category}</p>
          <p className="text-sm font-bold text-gray-900 leading-tight mb-2 line-clamp-2 group-hover:text-emerald-700 transition-colors">
            {item.name}
          </p>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg font-black text-gray-900">₹{item.price.toLocaleString()}</span>
            <span className="text-xs text-gray-400 line-through">₹{item.original_price.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Globe className="w-3 h-3" />
              {item.location}
            </span>
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {item.views}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Home() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"new" | "trending">("new");

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const [newRes, trendingRes] = await Promise.all([
        supabase.from("products").select("*").eq("status", "active").order("created_at", { ascending: false }).limit(8),
        supabase.from("products").select("*").eq("status", "active").order("views", { ascending: false }).limit(8),
      ]);
      if (newRes.data) setProducts(newRes.data);
      if (trendingRes.data) setTrendingProducts(trendingRes.data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/browse?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const displayProducts = activeTab === "new" ? products : trendingProducts;

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative bg-white overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-50 rounded-full opacity-60" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-amber-50 rounded-full opacity-40" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-20">
          <div className="flex flex-col lg:flex-row items-center gap-16">

            {/* Left */}
            <div className="flex-1 max-w-2xl">
              {/* Live badge */}
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-xs font-semibold px-4 py-2 rounded-full mb-8 border border-emerald-100">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                247 people browsing right now
              </div>

              {/* Headline */}
              <h1 className="text-5xl sm:text-6xl font-black text-gray-950 leading-[1.05] tracking-tight mb-6">
                Shop smarter.<br />
                <span className="relative">
                  <span className="text-emerald-600">Buy pre-loved.</span>
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                    <path d="M2 9C50 4 100 2 150 4C200 6 250 8 298 5" stroke="#059669" strokeWidth="3" strokeLinecap="round" opacity="0.4"/>
                  </svg>
                </span>
              </h1>

              <p className="text-lg text-gray-500 leading-relaxed mb-8 max-w-xl">
                India's #1 thrift marketplace. Discover amazing second-hand fashion, electronics, books & more — save up to <strong className="text-gray-800">80% off retail prices</strong>.
              </p>

              {/* Search bar */}
              <form onSubmit={handleSearch} className="flex gap-2 mb-8 max-w-xl">
                <div className="flex-1 flex items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 gap-3 focus-within:border-emerald-400 focus-within:bg-white transition-all shadow-sm">
                  <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder='Try "Nike shoes", "iPhone", "Saree"...'
                    className="bg-transparent text-sm outline-none w-full text-gray-700 placeholder-gray-400"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-emerald-600 text-white px-6 py-3 rounded-2xl text-sm font-bold hover:bg-emerald-700 transition-colors shadow-sm whitespace-nowrap"
                >
                  Search
                </button>
              </form>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3 mb-10">
                <Link href="/browse">
                  <button className="flex items-center gap-2 bg-gray-950 text-white px-7 py-3.5 rounded-2xl text-sm font-bold hover:bg-gray-800 transition-all shadow-sm">
                    <ShoppingBag className="w-4 h-4" />
                    Start Shopping
                  </button>
                </Link>
                <Link href="/seller/listings">
                  <button className="flex items-center gap-2 bg-white text-gray-800 border border-gray-200 px-7 py-3.5 rounded-2xl text-sm font-bold hover:border-gray-400 hover:bg-gray-50 transition-all shadow-sm">
                    <Tag className="w-4 h-4" />
                    Sell an Item
                  </button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-6 pt-8 border-t border-gray-100">
                {[
                  { icon: Package, value: "10K+", label: "Listings" },
                  { icon: Users, value: "5K+", label: "Sellers" },
                  { icon: Globe, value: "50+", label: "Countries" },
                  { icon: Star, value: "4.8★", label: "Rating" },
                ].map(({ icon: Icon, value, label }) => (
                  <div key={label} className="text-center sm:text-left">
                    <p className="text-2xl font-black text-gray-950 tracking-tight">{value}</p>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Product Grid */}
            <div className="flex-1 w-full max-w-lg lg:max-w-none">
              <div className="grid grid-cols-2 gap-4">
                {loading ? (
                  Array(4).fill(0).map((_, i) => (
                    <div key={i} className={`${i % 2 !== 0 ? "mt-8" : ""}`}>
                      <div className="bg-gray-100 rounded-3xl h-56 animate-pulse" />
                    </div>
                  ))
                ) : (
                  products.slice(0, 4).map((item, i) => {
                    const imageUrl = item.images?.[0]?.startsWith("http") ? item.images[0] : null;
                    return (
                      <Link href={`/product/${item.id}`} key={item.id}>
                        <div className={`group bg-white rounded-3xl border border-gray-100 hover:border-emerald-200 hover:shadow-xl shadow-sm transition-all duration-300 overflow-hidden cursor-pointer ${i % 2 !== 0 ? "mt-8" : ""}`}>
                          <div className="relative h-40 overflow-hidden bg-gray-50">
  {imageUrl ? (
    <Image src={imageUrl} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="200px" />
  ) : (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      {item.images?.[0] && !item.images[0].startsWith("http") ? (
        <span className="text-5xl">{item.images[0]}</span>
      ) : (
        <Package className="w-10 h-10 text-gray-200" />
      )}
    </div>
  )}
                            {discountPercent(item.price, item.original_price) > 0 && (
                              <span className="absolute top-2.5 right-2.5 bg-red-500 text-white text-xs font-black px-2 py-0.5 rounded-lg">
                                -{discountPercent(item.price, item.original_price)}%
                              </span>
                            )}
                          </div>
                          <div className="p-3.5">
                            <p className="text-xs font-bold text-gray-800 line-clamp-1 mb-1">{item.name}</p>
                            <p className="text-base font-black text-gray-950">₹{item.price.toLocaleString()}</p>
                            <p className="text-xs text-gray-400 line-through">₹{item.original_price.toLocaleString()}</p>
                          </div>
                        </div>
                      </Link>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust Bar ─────────────────────────────────────────────────────── */}
      <div className="bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {TRUST_BADGES.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0">
                  <Icon className="w-4.5 h-4.5 text-emerald-600" size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">{label}</p>
                  <p className="text-xs text-gray-400">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Categories ────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-4">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">Explore</p>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight">Shop by Category</h2>
          </div>
          <Link href="/browse" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-gray-500 hover:text-emerald-600 transition-colors">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-10 gap-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              onClick={() => router.push(`/browse?category=${encodeURIComponent(cat.slug)}`)}
              className={`group flex flex-col items-center gap-2 bg-gradient-to-b ${cat.color} rounded-2xl py-4 px-2 border border-white hover:shadow-md hover:scale-105 transition-all duration-200`}
            >
              <div className="relative w-10 h-10 rounded-xl overflow-hidden">
                <Image src={cat.image} alt={cat.name} fill className="object-cover" sizes="40px" />
              </div>
              <span className="text-xs font-bold text-gray-700 text-center leading-tight">{cat.name}</span>
              <span className="text-xs text-gray-400">{cat.count}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ── Products ──────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-1 bg-gray-100 rounded-2xl p-1 w-fit">
            <button
              onClick={() => setActiveTab("new")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === "new" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
            >
              <Zap className="w-3.5 h-3.5" />
              New Arrivals
            </button>
            <button
              onClick={() => setActiveTab("trending")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === "trending" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              Trending
            </button>
          </div>
          <Link href="/browse" className="flex items-center gap-1 text-sm font-semibold text-gray-500 hover:text-emerald-600 transition-colors">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {Array(8).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : displayProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
            <Package className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No products yet</p>
            <Link href="/seller/listings">
              <button className="mt-4 text-sm text-emerald-600 font-semibold hover:underline">Be the first to list →</button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {displayProducts.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link href="/browse">
            <button className="inline-flex items-center gap-2 border border-gray-200 text-gray-700 bg-white px-8 py-3.5 rounded-2xl text-sm font-bold hover:border-emerald-400 hover:text-emerald-600 transition-all shadow-sm">
              Browse All Products <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────────────────────── */}
      <section className="bg-white border-y border-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-2">Simple Process</p>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight">How Thriftly Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.step} className="flex flex-col items-center text-center">
                <div className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center mb-5`}>
                  <step.icon className="w-7 h-7" />
                </div>
                <span className="text-xs font-black text-gray-300 uppercase tracking-widest mb-2">Step {step.step}</span>
                <h3 className="text-base font-black text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed max-w-xs">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/how-it-works">
              <button className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:underline">
                Learn more about our process <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Sell Banner ───────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="relative bg-gray-950 rounded-3xl overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/10 rounded-full" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-emerald-500/5 rounded-full" />
          </div>
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 p-10 md:p-12">
            <div className="text-white text-center md:text-left">
              <p className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">For Sellers</p>
              <h2 className="text-2xl sm:text-3xl font-black mb-3 leading-tight">
                Turn your clutter<br />into cash 💸
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed max-w-md">
                List your pre-loved items in under 2 minutes. Join 5,000+ verified sellers. Zero listing fees — we only earn when you do.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link href="/seller/listings">
                <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white px-7 py-3.5 rounded-2xl text-sm font-black transition-all whitespace-nowrap">
                  <Tag className="w-4 h-4" />
                  Start Selling
                </button>
              </Link>
              <Link href="/how-it-works">
                <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-7 py-3.5 rounded-2xl text-sm font-bold transition-all whitespace-nowrap">
                  Learn More <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-2">Reviews</p>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight">
            Loved by thousands
          </h2>
          <p className="text-gray-400 text-sm mt-2">Real people, real experiences</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="bg-white rounded-3xl border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array(t.rating).fill(0).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm text-gray-700 leading-relaxed mb-5">"{t.text}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
                  <Image src={t.avatar} alt={t.name} fill className="object-cover" sizes="40px" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-bold text-gray-900">{t.name}</p>
                    {t.verified && (
                      <span className="text-emerald-500" title="Verified buyer">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Newsletter ────────────────────────────────────────────────────── */}
      <section className="bg-emerald-50 border-y border-emerald-100 py-14">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-black text-gray-950 mb-2">Get the best deals first 🎯</h2>
          <p className="text-gray-500 text-sm mb-6">Join 50,000+ shoppers who get early access to new listings and exclusive deals.</p>
          <form
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            onSubmit={(e) => { e.preventDefault(); }}
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 border border-gray-200 bg-white rounded-2xl px-5 py-3.5 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition"
            />
            <button
              type="submit"
              className="bg-emerald-600 text-white px-6 py-3.5 rounded-2xl text-sm font-bold hover:bg-emerald-700 transition whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
          <p className="text-xs text-gray-400 mt-3">No spam. Unsubscribe anytime.</p>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="bg-white border-t border-gray-100 pt-14 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">
            {/* Brand */}
            <div className="col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 bg-emerald-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-sm font-black">T</span>
                </div>
                <span className="text-xl font-black text-gray-950">Thriftly</span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed mb-5 max-w-xs">
                India's trusted global thrift marketplace. Buy & sell pre-loved items sustainably.
              </p>
              <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 rounded-xl px-3.5 py-2 w-fit">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs text-emerald-700 font-semibold">247 people online now</span>
              </div>
            </div>

            {/* Links */}
            {[
              {
                title: "Shop",
                links: [
                  { label: "Browse All", href: "/browse" },
                  { label: "New Arrivals", href: "/browse?sort=newest" },
                  { label: "Trending", href: "/browse?sort=trending" },
                  { label: "Categories", href: "/browse" },
                ],
              },
              {
                title: "Sell",
                links: [
                  { label: "Start Selling", href: "/seller/listings" },
                  { label: "Seller Dashboard", href: "/seller" },
                  { label: "How it works", href: "/how-it-works" },
                  { label: "Seller Guidelines", href: "/how-it-works" },
                ],
              },
              {
                title: "Support",
                links: [
                  { label: "Help Center", href: "/how-it-works" },
                  { label: "Buyer Protection", href: "/how-it-works" },
                  { label: "Contact Us", href: "/how-it-works" },
                  { label: "About Thriftly", href: "/how-it-works" },
                ],
              },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-sm font-black text-gray-900 mb-4">{col.title}</h4>
                <ul className="space-y-3">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link href={l.href} className="text-sm text-gray-400 hover:text-emerald-600 transition-colors">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-xs text-gray-400">
              © 2026 Thriftly. Made with ❤️ in India 🇮🇳 for the World 🌍
            </p>
            <div className="flex gap-5">
              <Link href="/privacy" className="text-xs text-gray-400 hover:text-emerald-600 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-xs text-gray-400 hover:text-emerald-600 transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}