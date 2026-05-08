"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/context/CartContext";
import {
  Search, ShoppingBag, Heart, Menu, X,
  ChevronDown, Package, LogOut, User,
  LayoutDashboard, Tag, HelpCircle,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role?: string;
}

// ─── Announcement messages (rotate) ──────────────────────────────────────────
const ANNOUNCEMENTS = [
  "🎉 Free shipping on orders above ₹999",
  "🌍 Ships to 50+ countries worldwide",
  "🔒 100% Buyer Protection on all orders",
  "✨ New arrivals added daily — check them out!",
];

// ─── Nav Links ────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: "Browse", href: "/browse" },
  { label: "Sell", href: "/seller/listings" },
  { label: "How it works", href: "/how-it-works" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { totalItems } = useCart();
  const searchRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState<UserProfile | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  // ── Auth listener ──────────────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || "",
          full_name: data.user.user_metadata?.full_name,
          avatar_url: data.user.user_metadata?.avatar_url,
          role: data.user.user_metadata?.role || "buyer",
        });
      }
    });

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

  // ── Scroll shadow ──────────────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Announcement rotator ───────────────────────────────────────────────────
  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementIndex(i => (i + 1) % ANNOUNCEMENTS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // ── Close menus on route change ────────────────────────────────────────────
  useEffect(() => {
    setShowMobileMenu(false);
    setShowUserMenu(false);
  }, [pathname]);

  // ── Keyboard shortcut ─────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowSearch(true);
        setTimeout(() => searchRef.current?.focus(), 50);
      }
      if (e.key === "Escape") {
        setShowSearch(false);
        setShowUserMenu(false);
        setShowMobileMenu(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
  };

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {