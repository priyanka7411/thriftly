"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/context/CartContext";
import {
  Search, ShoppingBag, Heart, Menu, X,
  User, LogOut, Package, Settings, ChevronDown,
  Tag, LayoutDashboard
} from "lucide-react";

interface NavUser {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role?: string;
}

const NAV_LINKS = [
  { href: "/browse", label: "Browse" },
  { href: "/seller/listings", label: "Sell" },
  { href: "/how-it-works", label: "How it works" },
];

const ANNOUNCEMENTS = [
  "🎉 Free shipping on orders above ₹999",
  "🌍 Ships to 50+ countries worldwide",
  "🔒 100% Buyer protection guaranteed",
  "⚡ New arrivals added daily",
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { totalItems } = useCart();

  const [user, setUser] = useState<NavUser | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [announcementIndex, setAnnounmentIndex] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // ── Auth ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser({
          id: user.id,
          email: user.email || "",
          full_name: user.user_metadata?.full_name,
          avatar_url: user.user_metadata?.avatar_url,
          role: user.user_metadata?.role || "buyer",
        });
      }
    };
    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || "",
          full_name: session.user.user_metadata?.full_name,
          avatar_url: session.user.user_metadata?.avatar_url,
          role: session.user.user_metadata?.role || "buyer",
        });
      } else {
        setUser(null);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // ── Rotating announcements ────────────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      setAnnounmentIndex((i) => (i + 1) % ANNOUNCEMENTS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // ── Scroll shadow ─────────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Close user menu on outside click ─────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Close mobile menu on route change ────────────────────────────────
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  // ── Keyboard shortcut ─────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/browse?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    } else {
      router.push("/browse");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserMenuOpen(false);
    router.push("/");
  };

  const userInitial = user?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U";

  return (
    <>
      {/* ── Announcement Bar ──────────────────────────────────────────── */}
      <div className="bg-gray-950 text-gray-300 text-xs py-2 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center transition-all duration-500">
          {ANNOUNCEMENTS[announcementIndex]}
        </div>
      </div>

      {/* ── Main Header ───────────────────────────────────────────────── */}
      <header className={`bg-white sticky top-0 z-50 transition-shadow duration-200 ${scrolled ? "shadow-sm border-b border-gray-100" : "border-b border-gray-100"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-4 h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0 mr-2">
              <div className="w-8 h-8 bg-emerald-600 rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-white text-sm font-black">T</span>
              </div>
              <span className="text-lg font-black text-gray-950 tracking-tight hidden sm:block">Thriftly</span>
            </Link>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 max-w-xl hidden md:flex">
              <div className="flex items-center w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2.5 gap-3 focus-within:border-emerald-400 focus-within:bg-white focus-within:shadow-sm transition-all">
                <Search className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder='Search "Nike", "iPhone", "Saree"...'
                  className="bg-transparent text-sm outline-none w-full text-gray-700 placeholder-gray-400"
                />
                <kbd className="hidden lg:flex items-center gap-1 text-xs text-gray-300 bg-gray-100 px-1.5 py-0.5 rounded-md font-mono shrink-0">
                  ⌘K
                </kbd>
              </div>
            </form>

            {/* Nav Links — Desktop */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    pathname === href || (href !== "/" && pathname?.startsWith(href))
                      ? "bg-emerald-50 text-emerald-700 font-semibold"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </nav>

            {/* Right Side */}
            <div className="flex items-center gap-1 ml-auto">

              {/* Mobile Search */}
              <button
                onClick={() => router.push("/browse")}
                className="md:hidden p-2.5 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <Link
                href="/buyer/wishlist"
                className="p-2.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors hidden sm:flex"
              >
                <Heart className="w-5 h-5" />
              </Link>

              {/* Cart */}
              <Link href="/cart" className="relative p-2.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors">
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-emerald-600 rounded-full text-white text-xs flex items-center justify-center font-bold px-1 leading-none">
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </Link>

              {/* User */}
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-2xl hover:bg-gray-50 transition-colors"
                  >
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt={user.full_name || "User"} className="w-8 h-8 rounded-full object-cover border border-gray-200" />
                    ) : (
                      <div className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-sm font-bold">
                        {userInitial}
                      </div>
                    )}
                    <ChevronDown className={`w-3.5 h-3.5 text-gray-400 hidden sm:block transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
                  </button>

                  {/* Dropdown */}
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                      {/* User info */}
                      <div className="px-4 py-3 border-b border-gray-50">
                        <p className="text-sm font-bold text-gray-900 truncate">{user.full_name || "My Account"}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      </div>

                      {/* Menu items */}
                      <div className="py-1">
                        <Link href="/buyer" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-emerald-600 transition-colors">
                          <LayoutDashboard className="w-4 h-4 text-gray-400" />
                          My Account
                        </Link>
                        <Link href="/buyer/orders" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-emerald-600 transition-colors">
                          <Package className="w-4 h-4 text-gray-400" />
                          My Orders
                        </Link>
                        <Link href="/buyer/wishlist" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-emerald-600 transition-colors">
                          <Heart className="w-4 h-4 text-gray-400" />
                          Wishlist
                        </Link>
                        <Link href="/seller/listings" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-emerald-600 transition-colors">
                          <Tag className="w-4 h-4 text-gray-400" />
                          Sell an Item
                        </Link>
                        <Link href="/seller" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-emerald-600 transition-colors">
                          <LayoutDashboard className="w-4 h-4 text-gray-400" />
                          Seller Dashboard
                        </Link>
                        <Link href="/buyer/settings" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-emerald-600 transition-colors">
                          <Settings className="w-4 h-4 text-gray-400" />
                          Settings
                        </Link>
                      </div>

                      <div className="border-t border-gray-50 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 ml-1">
                  <Link href="/login" className="hidden sm:block px-4 py-2 text-sm font-semibold text-gray-700 hover:text-emerald-600 transition-colors">
                    Login
                  </Link>
                  <Link href="/signup" className="px-4 py-2 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-sm">
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2.5 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors ml-1"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile Menu ─────────────────────────────────────────────── */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white">
            {/* Mobile Search */}
            <div className="px-4 pt-4 pb-2">
              <form onSubmit={handleSearch}>
                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 gap-3">
                  <Search className="w-4 h-4 text-gray-400 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="bg-transparent text-sm outline-none w-full text-gray-700 placeholder-gray-400"
                  />
                </div>
              </form>
            </div>

            {/* Mobile Nav Links */}
            <nav className="px-4 py-2 space-y-1">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    pathname === href || (href !== "/" && pathname?.startsWith(href))
                      ? "bg-emerald-50 text-emerald-700 font-semibold"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </nav>

            {/* Mobile Auth */}
            {!user && (
              <div className="px-4 pb-4 pt-2 flex gap-2 border-t border-gray-50 mt-2">
                <Link href="/login" className="flex-1 text-center py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700">
                  Login
                </Link>
                <Link href="/signup" className="flex-1 text-center py-3 bg-emerald-600 text-white rounded-xl text-sm font-bold">
                  Sign Up
                </Link>
              </div>
            )}

            {user && (
              <div className="px-4 pb-4 pt-2 border-t border-gray-50 mt-2">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold">
                    {userInitial}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{user.full_name || "My Account"}</p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-center py-3 border border-red-200 text-red-500 rounded-xl text-sm font-semibold"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </header>
    </>
  );
}