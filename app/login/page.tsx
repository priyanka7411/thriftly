"use client";
import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      router.push("/buyer");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Left Panel */}
      <div className="hidden md:flex flex-1 bg-emerald-600 flex-col justify-between p-12">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-emerald-600 text-sm font-black">T</div>
          <span className="text-xl font-black text-white">Thriftly</span>
        </Link>
        <div>
          <p className="text-4xl font-black text-white leading-tight mb-4">
            Welcome back! <br /> Good to see you. 👋
          </p>
          <p className="text-emerald-100 text-sm leading-relaxed max-w-xs">
            Thousands of pre-loved items are waiting for you. Login and continue your sustainable shopping journey.
          </p>
        </div>
        <div className="flex gap-6">
          {[["10K+", "Products"], ["5K+", "Sellers"], ["4.8★", "Rating"]].map(([num, label]) => (
            <div key={label}>
              <p className="text-xl font-black text-white">{num}</p>
              <p className="text-xs text-emerald-200">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">

          <Link href="/" className="flex md:hidden items-center gap-2 mb-8 justify-center">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white text-sm font-black">T</div>
            <span className="text-xl font-black text-gray-900">Thriftly</span>
          </Link>

          <h2 className="text-3xl font-black text-gray-900 mb-1">Login</h2>
          <p className="text-gray-400 text-sm mb-8">
            Don't have an account?{" "}
            <Link href="/signup" className="text-emerald-600 font-semibold hover:underline">Sign up free</Link>
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4 font-medium">
              ⚠️ {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-600 mb-1.5 block">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition bg-white"
              />
            </div>
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-xs font-bold text-gray-600">Password</label>
                <a href="#" className="text-xs text-emerald-600 hover:underline font-medium">Forgot password?</a>
              </div>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition bg-white"
              />
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-emerald-600 text-white py-3 rounded-xl text-sm font-bold hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Login to Thriftly →"}
            </button>
          </div>

          <p className="text-center text-xs text-gray-400 mt-8">
            By continuing you agree to our{" "}
            <a href="#" className="text-emerald-600 hover:underline">Terms</a> &{" "}
            <a href="#" className="text-emerald-600 hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}