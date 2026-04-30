"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/context/CartContext"; // ✅ added

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const { totalItems } = useCart(); // ✅ added

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-emerald-900 text-emerald-100 text-center text-xs py-2 font-medium tracking-wide">
        🎉 Free shipping on orders above ₹999 &nbsp;·&nbsp; 🌍 Ships to 50+ countries &nbsp;·&nbsp; 🔒 Buyer protection guaranteed
      </div>

      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-6">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white text-sm font-black">T</div>
            <span className="text-xl font-black text-gray-900 tracking-tight">Thriftly</span>
          </Link>

          {/* Search */}
          <div className="flex-1 max-w-xl">
            <div className="flex items-center bg-gray-100 rounded-xl px-4 py-2.5 gap-3 border border-transparent focus-within:border-emerald-500 focus-within:bg-white transition">
              <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder='Try "Nike shoes" or "Silk saree"...'
                className="bg-transparent text-sm outline-none w-full text-gray-700 placeholder-gray-400"
                onKeyDown={(e) => {
                  if (e.key === "Enter") router.push("/browse");
                }}
              />
              <span className="text-xs text-gray-300 shrink-0 hidden md:block">⌘K</span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/browse" className={`text-sm font-medium transition ${pathname === "/browse" ? "text-emerald-700 font-bold border-b-2 border-emerald-600 pb-0.5" : "text-gray-600 hover:text-emerald-700"}`}>
              Browse
            </Link>
            <Link href="/seller" className={`text-sm font-medium transition ${pathname === "/seller" ? "text-emerald-700 font-bold" : "text-gray-600 hover:text-emerald-700"}`}>
              Sell
            </Link>
            <Link href="/how-it-works" className={`text-sm font-medium transition ${pathname === "/how-it-works" ? "text-emerald-700 font-bold" : "text-gray-600 hover:text-emerald-700"}`}>
              How it works
            </Link>
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/buyer/wishlist" className="p-2 text-gray-500 hover:text-red-500 transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </Link>

            {/* ✅ UPDATED CART */}
            <Link href="/cart" className="p-2 text-gray-500 hover:text-emerald-700 transition relative">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>

              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-2">
                <Link href="/buyer">
                  <div className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-sm font-black cursor-pointer hover:bg-emerald-200 transition">
                    {user.email?.[0].toUpperCase()}
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-xs text-gray-500 hover:text-red-500 font-medium transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link href="/login" className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-emerald-700 transition">Login</Link>
                <Link href="/signup" className="px-4 py-2 text-sm font-semibold bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
}