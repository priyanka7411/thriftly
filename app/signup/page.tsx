"use client";
import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Signup() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSignup = async () => {
    setLoading(true);
    setError("");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: `${firstName} ${lastName}`,
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      await supabase.from("profiles").insert({
        id: data.user.id,
        full_name: `${firstName} ${lastName}`,
        email: email,
        role: "buyer",
      });
      setSuccess(true);
    }

    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-md w-full max-w-md p-8 text-center">
          <div className="text-5xl mb-4">📧</div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Check your email!</h2>
          <p className="text-sm text-gray-500 mb-6">
            We sent a confirmation link to <span className="font-bold text-emerald-600">{email}</span>. Click it to activate your account.
          </p>
          <Link href="/login">
            <button className="w-full bg-emerald-600 text-white py-3 rounded-xl text-sm font-bold hover:bg-emerald-700 transition">
              Go to Login →
            </button>
          </Link>
        </div>
      </div>
    );
  }

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
            Join 5,000+ <br /> sellers & buyers. 🌿
          </p>
          <p className="text-emerald-100 text-sm leading-relaxed max-w-xs">
            Create your free account and start buying or selling pre-loved items in minutes.
          </p>
        </div>
        <div className="bg-emerald-700 rounded-2xl p-5">
          <p className="text-white text-sm italic mb-3">"Sold my old laptop in 2 days on Thriftly. Super easy!"</p>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-400 rounded-full flex items-center justify-center text-white text-xs font-black">R</div>
            <div>
              <p className="text-white text-xs font-bold">Riya Sharma</p>
              <p className="text-emerald-300 text-xs">Seller · Mumbai</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link href="/" className="flex md:hidden items-center gap-2 mb-8 justify-center">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white text-sm font-black">T</div>
            <span className="text-xl font-black text-gray-900">Thriftly</span>
          </Link>

          <h2 className="text-3xl font-black text-gray-900 mb-1">Create Account</h2>
          <p className="text-gray-400 text-sm mb-8">
            Already have an account?{" "}
            <Link href="/login" className="text-emerald-600 font-semibold hover:underline">Login</Link>
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4 font-medium">
              ⚠️ {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">First Name</label>
                <input
                  type="text"
                  placeholder="Priya"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition bg-white"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Last Name</label>
                <input
                  type="text"
                  placeholder="Sharma"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition bg-white"
                />
              </div>
            </div>
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
              <label className="text-xs font-bold text-gray-600 mb-1.5 block">Password</label>
              <input
                type="password"
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition bg-white"
              />
            </div>

            <button
              onClick={handleSignup}
              disabled={loading}
              className="w-full bg-emerald-600 text-white py-3 rounded-xl text-sm font-bold hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Create Free Account →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}