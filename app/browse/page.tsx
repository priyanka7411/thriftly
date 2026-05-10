"use client";

import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import {
  Search, SlidersHorizontal, X, ChevronDown,
  Grid3X3, List, ShoppingBag, Heart, Package,
  ArrowUpDown, Eye, MapPin, Sparkles, TrendingUp,
  CheckCircle2
} from "lucide-react";

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
  status: string;
  views: number;
  description: string;
  created_at: string;
}

type SortOption = "newest" | "price_asc" | "price_desc" | "popular" | "discount";
type ViewMode = "grid" | "list";

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  "All", "Clothing", "Ethnic Wear", "Shoes", "Electronics",
  "Books", "Furniture", "Gaming", "Beauty", "Bags", "Accessories"
];

const CONDITIONS = ["Like New", "Good", "Fair"] as const;

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest First" },
  { value: "popular", label: "Most Popular" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "discount", label: "Biggest Discount" },
];

const PRICE_RANGES = [
  { label: "Under ₹500", min: 0, max: 500 },
  { label: "₹500 – ₹1,000", min: 500, max: 1000 },
  { label: "₹1,000 – ₹5,000", min: 1000, max: 5000 },
  { label: "₹5,000 – ₹20,000", min: 5000, max: 20000 },
  { label: "Above ₹20,000", min: 20000, max: Infinity },
];

const CONDITION_STYLES: Record<string, string> = {
  "Like New": "bg-emerald-100 text-emerald-700",
  "Good": "bg-blue-100 text-blue-700",
  "Fair": "bg-amber-100 text-amber-700",
};

// ─── Helper ───────────────────────────────────────────────────────────────────

const discountPercent = (price: number, original: number) =>
  original > price ? Math.round(((original - price) / original) * 100) : 0;

// ─── Product Image ────────────────────────────────────────────────────────────

function ProductImage({ src, alt }: { src: string; alt: string }) {
  if (src?.startsWith("http")) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-500"
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
      />
    );
  }
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <Package className="w-10 h-10 text-gray-200" />
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function CardSkeleton({ view }: { view: ViewMode }) {
  if (view === "list") {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4 animate-pulse">
        <div className="w-24 h-24 bg-gray-100 rounded-xl shrink-0" />
        <div className="flex-1 space-y-2.5">
          <div className="h-3.5 bg-gray-100 rounded-full w-2/3" />
          <div className="h-3 bg-gray-100 rounded-full w-1/3" />
          <div className="h-4 bg-gray-100 rounded-full w-1/4" />
        </div>
      </div>
    );
  }
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
      <div className="bg-gray-100 h-52" />
      <div className="p-4 space-y-2.5">
        <div className="h-3.5 bg-gray-100 rounded-full w-3/4" />
        <div className="h-3 bg-gray-100 rounded-full w-1/2" />
        <div className="h-4 bg-gray-100 rounded-full w-1/3" />
        <div className="h-8 bg-gray-100 rounded-xl" />
      </div>
    </div>
  );
}

// ─── Product Card (Grid) ──────────────────────────────────────────────────────

function GridCard({
  item,
  onAddToCart,
  addedId,
  wishlisted,
  onWishlist,
}: {
  item: Product;
  onAddToCart: (item: Product) => void;
  addedId: number | null;
  wishlisted: Set<number>;
  onWishlist: (id: number) => void;
}) {
  const discount = discountPercent(item.price, item.original_price);
  const isAdded = addedId === item.id;
  const isWishlisted = wishlisted.has(item.id);

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 hover:border-emerald-200 hover:shadow-xl shadow-sm transition-all duration-300 overflow-hidden flex flex-col">
      {/* Image */}
      <Link href={`/product/${item.id}`} className="block relative h-52 overflow-hidden bg-gray-50 shrink-0">
        <ProductImage src={item.images?.[0]} alt={item.name} />

        {/* Discount badge */}
        {discount > 0 && (
          <div className="absolute top-3 right-3 z-10">
            <span className="bg-red-500 text-white text-xs font-black px-2.5 py-1 rounded-xl shadow-sm">
              -{discount}%
            </span>
          </div>
        )}

        {/* Wishlist */}
        <button
          onClick={(e) => { e.preventDefault(); onWishlist(item.id); }}
          className={`absolute top-3 left-3 z-10 w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-all opacity-0 group-hover:opacity-100 ${
            isWishlisted
              ? "bg-red-500 text-white"
              : "bg-white/90 backdrop-blur-sm text-gray-400 hover:text-red-500 hover:bg-white"
          }`}
        >
          <Heart className="w-4 h-4" fill={isWishlisted ? "currentColor" : "none"} />
        </button>

        {/* Condition */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-xl ${CONDITION_STYLES[item.condition] || "bg-gray-100 text-gray-600"}`}>
            {item.condition}
          </span>
        </div>
      </Link>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-gray-400 font-medium mb-1">{item.category}</p>
        <Link href={`/product/${item.id}`}>
          <p className="text-sm font-bold text-gray-900 leading-snug mb-2 line-clamp-2 hover:text-emerald-700 transition-colors">
            {item.name}
          </p>
        </Link>

        <div className="flex items-baseline gap-2 mb-3 mt-auto">
          <span className="text-lg font-black text-gray-950">₹{item.price.toLocaleString()}</span>
          <span className="text-xs text-gray-400 line-through">₹{item.original_price.toLocaleString()}</span>
        </div>

        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {item.location?.replace(/🇮🇳|🇺🇸|🇬🇧|🌍/g, "").trim()}
          </span>
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {item.views}
          </span>
        </div>

        <button
          onClick={() => onAddToCart(item)}
          className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            isAdded
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-gray-950 text-white hover:bg-gray-800"
          }`}
        >
          {isAdded ? (
            <><CheckCircle2 className="w-3.5 h-3.5" /> Added to Cart</>
          ) : (
            <><ShoppingBag className="w-3.5 h-3.5" /> Add to Cart</>
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Product Card (List) ──────────────────────────────────────────────────────

function ListCard({
  item,
  onAddToCart,
  addedId,
  wishlisted,
  onWishlist,
}: {
  item: Product;
  onAddToCart: (item: Product) => void;
  addedId: number | null;
  wishlisted: Set<number>;
  onWishlist: (id: number) => void;
}) {
  const discount = discountPercent(item.price, item.original_price);
  const isAdded = addedId === item.id;
  const isWishlisted = wishlisted.has(item.id);

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 hover:border-emerald-200 hover:shadow-md shadow-sm transition-all duration-300 overflow-hidden flex gap-0">
      {/* Image */}
      <Link href={`/product/${item.id}`} className="relative w-32 sm:w-44 shrink-0 overflow-hidden bg-gray-50">
        <ProductImage src={item.images?.[0]} alt={item.name} />
        {discount > 0 && (
          <div className="absolute top-2 left-2 z-10">
            <span className="bg-red-500 text-white text-xs font-black px-2 py-0.5 rounded-lg">-{discount}%</span>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="flex-1 p-4 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <p className="text-xs text-gray-400 font-medium mb-1">{item.category}</p>
            <Link href={`/product/${item.id}`}>
              <p className="text-sm font-bold text-gray-900 leading-snug hover:text-emerald-700 transition-colors line-clamp-2 mb-1">
                {item.name}
              </p>
            </Link>
            {item.description && (
              <p className="text-xs text-gray-400 line-clamp-2 hidden sm:block">{item.description}</p>
            )}
          </div>
          <button
            onClick={() => onWishlist(item.id)}
            className={`p-1.5 rounded-xl transition-colors shrink-0 ${isWishlisted ? "text-red-500" : "text-gray-300 hover:text-red-400"}`}
          >
            <Heart className="w-4 h-4" fill={isWishlisted ? "currentColor" : "none"} />
          </button>
        </div>

        <div className="flex items-center justify-between mt-auto pt-3">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-black text-gray-950">₹{item.price.toLocaleString()}</span>
              <span className="text-xs text-gray-400 line-through">₹{item.original_price.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${CONDITION_STYLES[item.condition] || "bg-gray-100 text-gray-600"}`}>
                {item.condition}
              </span>
              <span className="text-xs text-gray-400 flex items-center gap-0.5">
                <MapPin className="w-3 h-3" />
                {item.location?.replace(/🇮🇳|🇺🇸|🇬🇧|🌍/g, "").trim()}
              </span>
            </div>
          </div>
          <button
            onClick={() => onAddToCart(item)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              isAdded
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-gray-950 text-white hover:bg-gray-800"
            }`}
          >
            {isAdded ? <><CheckCircle2 className="w-3.5 h-3.5" /> Added</> : <><ShoppingBag className="w-3.5 h-3.5" /> Add</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Filter Sidebar ───────────────────────────────────────────────────────────

function FilterSidebar({
  selectedCategory,
  setSelectedCategory,
  selectedConditions,
  toggleCondition,
  selectedPriceRange,
  setSelectedPriceRange,
  onClear,
  hasActiveFilters,
}: {
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
  selectedConditions: string[];
  toggleCondition: (c: string) => void;
  selectedPriceRange: number | null;
  setSelectedPriceRange: (i: number | null) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
}) {
  return (
    <div className="space-y-4">
      {/* Category */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h3 className="text-xs font-black text-gray-500 uppercase tracking-wider mb-4">Category</h3>
        <div className="space-y-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all ${
                selectedCategory === cat
                  ? "bg-emerald-50 text-emerald-700 font-semibold"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <span>{cat}</span>
              {selectedCategory === cat && (
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Condition */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h3 className="text-xs font-black text-gray-500 uppercase tracking-wider mb-4">Condition</h3>
        <div className="space-y-2">
          {CONDITIONS.map((c) => (
            <label key={c} className="flex items-center gap-3 cursor-pointer group py-1">
              <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${
                selectedConditions.includes(c)
                  ? "bg-emerald-600 border-emerald-600"
                  : "border-gray-200 group-hover:border-emerald-300"
              }`}>
                {selectedConditions.includes(c) && (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <input
                type="checkbox"
                checked={selectedConditions.includes(c)}
                onChange={() => toggleCondition(c)}
                className="sr-only"
              />
              <span className={`text-sm transition-colors ${selectedConditions.includes(c) ? "text-emerald-700 font-semibold" : "text-gray-600"}`}>
                {c}
              </span>
              <span className={`ml-auto text-xs px-2 py-0.5 rounded-lg font-medium ${CONDITION_STYLES[c]}`}>
                {c === "Like New" ? "Best" : c === "Good" ? "Great" : "Value"}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h3 className="text-xs font-black text-gray-500 uppercase tracking-wider mb-4">Price Range</h3>
        <div className="space-y-1">
          {PRICE_RANGES.map((range, i) => (
            <button
              key={i}
              onClick={() => setSelectedPriceRange(selectedPriceRange === i ? null : i)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all ${
                selectedPriceRange === i
                  ? "bg-emerald-50 text-emerald-700 font-semibold"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span>{range.label}</span>
              {selectedPriceRange === i && <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />}
            </button>
          ))}
        </div>
      </div>

      {/* Clear */}
      {hasActiveFilters && (
        <button
          onClick={onClear}
          className="w-full flex items-center justify-center gap-2 py-3 border border-red-200 text-red-500 rounded-2xl text-sm font-bold hover:bg-red-50 transition-colors"
        >
          <X className="w-4 h-4" /> Clear All Filters
        </button>
      )}
    </div>
  );
}

// ─── Main Browse Page ─────────────────────────────────────────────────────────

function BrowseContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToCart } = useCart();

  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "All");
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [addedId, setAddedId] = useState<number | null>(null);
  const [wishlisted, setWishlisted] = useState<Set<number>>(new Set());
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  const searchTimerRef = useRef<NodeJS.Timeout>();

  // ── Fetch ─────────────────────────────────────────────────────────────
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (!error && data) setProducts(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // ── Sync URL params ───────────────────────────────────────────────────
  useEffect(() => {
    const cat = searchParams.get("category");
    const q = searchParams.get("search");
    if (cat) setSelectedCategory(cat);
    if (q) setSearch(q);
  }, [searchParams]);

  // ── Debounced search URL update ───────────────────────────────────────
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
    clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      if (value) params.set("search", value);
      else params.delete("search");
      router.replace(`/browse?${params.toString()}`, { scroll: false });
    }, 400);
  };

  const toggleCondition = (c: string) => {
    setPage(1);
    setSelectedConditions(prev =>
      prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]
    );
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setPage(1);
    const params = new URLSearchParams(window.location.search);
    if (cat !== "All") params.set("category", cat);
    else params.delete("category");
    router.replace(`/browse?${params.toString()}`, { scroll: false });
  };

  const handleAddToCart = (item: Product) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      original: item.original_price,
      emoji: item.images?.[0]?.startsWith("http") ? "🛍️" : (item.images?.[0] || "🛍️"),
      seller: "seller",
      condition: item.condition,
    });
    setAddedId(item.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  const handleWishlist = (id: number) => {
    setWishlisted(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const clearFilters = () => {
    setSelectedCategory("All");
    setSelectedConditions([]);
    setSelectedPriceRange(null);
    setSearch("");
    setPage(1);
    router.replace("/browse", { scroll: false });
  };

  // ── Filter + Sort ─────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== "All") {
      result = result.filter(p => p.category === selectedCategory);
    }

    if (selectedConditions.length > 0) {
      result = result.filter(p => selectedConditions.includes(p.condition));
    }

    if (selectedPriceRange !== null) {
      const range = PRICE_RANGES[selectedPriceRange];
      result = result.filter(p => p.price >= range.min && p.price < range.max);
    }

    switch (sortBy) {
      case "price_asc": result.sort((a, b) => a.price - b.price); break;
      case "price_desc": result.sort((a, b) => b.price - a.price); break;
      case "popular": result.sort((a, b) => b.views - a.views); break;
      case "discount": result.sort((a, b) => discountPercent(b.price, b.original_price) - discountPercent(a.price, a.original_price)); break;
      default: result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return result;
  }, [products, search, selectedCategory, selectedConditions, selectedPriceRange, sortBy]);

  // ── Pagination ────────────────────────────────────────────────────────
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const hasActiveFilters = selectedCategory !== "All" || selectedConditions.length > 0 || selectedPriceRange !== null || search.trim() !== "";

  // Active filter chips
  const activeChips: { label: string; onRemove: () => void }[] = [];
  if (selectedCategory !== "All") activeChips.push({ label: selectedCategory, onRemove: () => handleCategoryChange("All") });
  selectedConditions.forEach(c => activeChips.push({ label: c, onRemove: () => toggleCondition(c) }));
  if (selectedPriceRange !== null) activeChips.push({ label: PRICE_RANGES[selectedPriceRange].label, onRemove: () => setSelectedPriceRange(null) });
  if (search) activeChips.push({ label: `"${search}"`, onRemove: () => handleSearchChange("") });

  const currentSort = SORT_OPTIONS.find(s => s.value === sortBy)!;

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <Navbar />

      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
            <Link href="/" className="hover:text-emerald-600 transition-colors">Home</Link>
            <span>›</span>
            {selectedCategory !== "All" ? (
              <>
                <button onClick={() => handleCategoryChange("All")} className="hover:text-emerald-600 transition-colors">Browse</button>
                <span>›</span>
                <span className="text-gray-700 font-medium">{selectedCategory}</span>
              </>
            ) : (
              <span className="text-gray-700 font-medium">Browse All</span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-gray-950 tracking-tight">
                {selectedCategory !== "All" ? selectedCategory : "All Products"}
              </h1>
              <p className="text-sm text-gray-400 mt-0.5">
                {loading ? "Loading products..." : `${filtered.length.toLocaleString()} items found`}
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 gap-2 focus-within:border-emerald-400 focus-within:bg-white transition-all w-52">
                <Search className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search products..."
                  className="bg-transparent text-sm outline-none w-full text-gray-700 placeholder-gray-400"
                />
                {search && (
                  <button onClick={() => handleSearchChange("")} className="text-gray-400 hover:text-gray-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium text-gray-700 hover:border-gray-300 transition-all whitespace-nowrap">
                  <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
                  <span className="hidden sm:inline">{currentSort.label}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>
                <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-30 hidden group-hover:block">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => { setSortBy(opt.value); setPage(1); }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        sortBy === opt.value
                          ? "text-emerald-600 font-semibold bg-emerald-50"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* View Toggle */}
              <div className="flex items-center bg-gray-100 rounded-xl p-1 hidden sm:flex">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-lg transition-all ${viewMode === "grid" ? "bg-white shadow-sm text-gray-900" : "text-gray-400 hover:text-gray-600"}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-lg transition-all ${viewMode === "list" ? "bg-white shadow-sm text-gray-900" : "text-gray-400 hover:text-gray-600"}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Mobile Filter Button */}
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="md:hidden flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium text-gray-700"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {hasActiveFilters && (
                  <span className="bg-emerald-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {activeChips.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Active Filter Chips */}
          {activeChips.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {activeChips.map((chip) => (
                <button
                  key={chip.label}
                  onClick={chip.onRemove}
                  className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-emerald-100 transition-colors"
                >
                  {chip.label}
                  <X className="w-3 h-3" />
                </button>
              ))}
              <button
                onClick={clearFilters}
                className="text-xs text-gray-400 hover:text-red-500 font-medium transition-colors px-2 py-1.5"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Category Pills ───────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-50 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex gap-2 overflow-x-auto py-3 scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`shrink-0 flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full transition-all ${
                  selectedCategory === cat
                    ? "bg-gray-950 text-white shadow-sm"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-gray-400 hover:text-gray-900"
                }`}
              >
                {cat === "new" && <Sparkles className="w-3 h-3" />}
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Content ─────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-8">

          {/* Sidebar — Desktop */}
          <aside className="w-64 shrink-0 hidden md:block">
            <div className="sticky top-36">
              <FilterSidebar
                selectedCategory={selectedCategory}
                setSelectedCategory={handleCategoryChange}
                selectedConditions={selectedConditions}
                toggleCondition={toggleCondition}
                selectedPriceRange={selectedPriceRange}
                setSelectedPriceRange={setSelectedPriceRange}
                onClear={clearFilters}
                hasActiveFilters={hasActiveFilters}
              />
            </div>
          </aside>

          {/* Products */}
          <div className="flex-1 min-w-0">

            {/* Loading */}
            {loading && (
              <div className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-2 md:grid-cols-3" : "grid-cols-1"}`}>
                {Array(ITEMS_PER_PAGE).fill(0).map((_, i) => (
                  <CardSkeleton key={i} view={viewMode} />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && filtered.length === 0 && (
              <div className="text-center py-24 bg-white rounded-3xl border border-gray-100">
                <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-5">
                  <Package className="w-9 h-9 text-gray-200" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No products found</h3>
                <p className="text-sm text-gray-400 mb-6 max-w-xs mx-auto">
                  {search ? `No results for "${search}"` : "Try adjusting your filters to find what you're looking for."}
                </p>
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors"
                >
                  <X className="w-4 h-4" /> Clear Filters
                </button>
              </div>
            )}

            {/* Results */}
            {!loading && paginated.length > 0 && (
              <>
                <div className={`grid gap-4 ${
                  viewMode === "grid"
                    ? "grid-cols-2 sm:grid-cols-2 md:grid-cols-3"
                    : "grid-cols-1"
                }`}>
                  {paginated.map((item) =>
                    viewMode === "grid" ? (
                      <GridCard
                        key={item.id}
                        item={item}
                        onAddToCart={handleAddToCart}
                        addedId={addedId}
                        wishlisted={wishlisted}
                        onWishlist={handleWishlist}
                      />
                    ) : (
                      <ListCard
                        key={item.id}
                        item={item}
                        onAddToCart={handleAddToCart}
                        addedId={addedId}
                        wishlisted={wishlisted}
                        onWishlist={handleWishlist}
                      />
                    )
                  )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    <button
                      onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo(0, 0); }}
                      disabled={page === 1}
                      className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-sm font-bold text-gray-500 hover:border-emerald-400 hover:text-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      ‹
                    </button>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const p = totalPages <= 5 ? i + 1 : page <= 3 ? i + 1 : page >= totalPages - 2 ? totalPages - 4 + i : page - 2 + i;
                      return (
                        <button
                          key={p}
                          onClick={() => { setPage(p); window.scrollTo(0, 0); }}
                          className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                            page === p
                              ? "bg-gray-950 text-white shadow-sm"
                              : "border border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-900"
                          }`}
                        >
                          {p}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => { setPage(p => Math.min(totalPages, p + 1)); window.scrollTo(0, 0); }}
                      disabled={page === totalPages}
                      className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-sm font-bold text-gray-500 hover:border-emerald-400 hover:text-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      ›
                    </button>
                  </div>
                )}

                <p className="text-center text-xs text-gray-400 mt-3">
                  Showing {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} products
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile Filter Drawer ─────────────────────────────────────── */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-[#FAFAF9] rounded-t-3xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-white rounded-t-3xl">
              <h2 className="text-base font-black text-gray-900">Filters</h2>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <div className="p-5">
              <FilterSidebar
                selectedCategory={selectedCategory}
                setSelectedCategory={(cat) => { handleCategoryChange(cat); setMobileFiltersOpen(false); }}
                selectedConditions={selectedConditions}
                toggleCondition={toggleCondition}
                selectedPriceRange={selectedPriceRange}
                setSelectedPriceRange={setSelectedPriceRange}
                onClear={() => { clearFilters(); setMobileFiltersOpen(false); }}
                hasActiveFilters={hasActiveFilters}
              />
            </div>
            <div className="p-5 pt-0">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full bg-gray-950 text-white py-3.5 rounded-2xl text-sm font-bold"
              >
                Show {filtered.length} Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Export with Suspense ─────────────────────────────────────────────────────

export default function Browse() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAFAF9]">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array(8).fill(0).map((_, i) => <CardSkeleton key={i} view="grid" />)}
          </div>
        </div>
      </div>
    }>
      <BrowseContent />
    </Suspense>
  );
}