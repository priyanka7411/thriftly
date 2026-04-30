"use client";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

const conditionStyle: Record<string, string> = {
  "Like New": "bg-emerald-50 text-emerald-700 border border-emerald-200",
  "Good": "bg-blue-50 text-blue-700 border border-blue-200",
  "Fair": "bg-amber-50 text-amber-700 border border-amber-200",
};

export default function Cart() {
  const { items, removeFromCart, updateQuantity, totalPrice } = useCart();
  const router = useRouter();
  const savings = items.reduce((sum, i) => sum + (i.original - i.price) * i.quantity, 0);
  const shipping = totalPrice >= 999 ? 0 : 99;
  const total = totalPrice + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans">
        <Navbar />
        <div className="max-w-2xl mx-auto px-6 py-24 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-400 text-sm mb-6">Looks like you haven't added anything yet!</p>
          <Link href="/browse">
            <button className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition">
              🛍️ Start Shopping
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-8">

        <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
          <Link href="/" className="hover:text-emerald-600">Home</Link>
          <span>›</span>
          <span className="text-gray-700 font-medium">Cart</span>
        </div>

        <h1 className="text-2xl font-black text-gray-900 mb-6">
          Your Cart <span className="text-gray-400 font-medium text-lg">({items.length} items)</span>
        </h1>

        {totalPrice < 999 && (
          <div className="bg-orange-50 border border-orange-200 rounded-2xl px-5 py-3 mb-6 flex items-center gap-3">
            <span>🚚</span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-orange-800">
                Add items worth <span className="font-black">₹{999 - totalPrice}</span> more for FREE shipping!
              </p>
              <div className="mt-1.5 bg-orange-200 rounded-full h-1.5">
                <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: `${Math.min((totalPrice / 999) * 100, 100)}%` }}></div>
              </div>
            </div>
          </div>
        )}
        {totalPrice >= 999 && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-3 mb-6 flex items-center gap-3">
            <span>🎉</span>
            <p className="text-sm font-semibold text-emerald-800">You've unlocked <span className="font-black">FREE shipping!</span></p>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border border-gray-200 p-4 flex gap-4 hover:border-emerald-200 transition">
                <Link href={`/product/${item.id}`}>
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center text-4xl shrink-0 cursor-pointer hover:shadow-md transition">
                    {item.emoji}
                  </div>
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link href={`/product/${item.id}`}>
                        <p className="text-sm font-black text-gray-900 hover:text-emerald-700 transition">{item.name}</p>
                      </Link>
                      <p className="text-xs text-gray-400 mt-0.5">@{item.seller}</p>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 transition shrink-0 text-xl font-bold">×</button>
                  </div>
                  <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mt-2 ${conditionStyle[item.condition] || "bg-gray-100 text-gray-600"}`}>
                    {item.condition}
                  </span>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 bg-white rounded-lg text-sm font-bold text-gray-600 hover:text-emerald-700 shadow-sm transition">−</button>
                      <span className="text-sm font-black text-gray-900 w-5 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 bg-white rounded-lg text-sm font-bold text-gray-600 hover:text-emerald-700 shadow-sm transition">+</button>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-black text-emerald-700">₹{(item.price * item.quantity).toLocaleString()}</p>
                      <p className="text-xs text-gray-400 line-through">₹{(item.original * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <Link href="/browse">
              <div className="text-sm font-semibold text-emerald-700 hover:underline cursor-pointer mt-2">← Continue Shopping</div>
            </Link>
          </div>

          <div className="w-full lg:w-80 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-24">
              <h2 className="text-lg font-black text-gray-900 mb-5">Order Summary</h2>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Subtotal ({items.length} items)</span>
                  <span className="text-sm font-semibold">₹{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">You Save</span>
                  <span className="text-sm font-bold text-emerald-600">−₹{savings.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Shipping</span>
                  <span className={`text-sm font-bold ${shipping === 0 ? "text-emerald-600" : "text-gray-900"}`}>
                    {shipping === 0 ? "FREE 🎉" : `₹${shipping}`}
                  </span>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-4 mb-5">
                <div className="flex justify-between">
                  <span className="text-base font-black text-gray-900">Total</span>
                  <span className="text-base font-black text-gray-900">₹{total.toLocaleString()}</span>
                </div>
                <p className="text-xs text-emerald-600 font-semibold mt-1">🎉 Saving ₹{savings.toLocaleString()} on this order!</p>
              </div>
              <div className="flex gap-2 mb-5">
                <input type="text" placeholder="Coupon code" className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-500 transition" />
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-200 transition">Apply</button>
              </div>
              <button onClick={() => router.push("/checkout")} className="w-full bg-emerald-600 text-white py-4 rounded-2xl text-sm font-black hover:bg-emerald-700 transition mb-3">
                Proceed to Checkout →
              </button>
              <div className="mt-4 space-y-1.5">
                {["🔒 100% Secure Checkout", "↩️ Easy returns within 7 days", "💬 24/7 Buyer support"].map(t => (
                  <p key={t} className="text-xs text-gray-400">{t}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}