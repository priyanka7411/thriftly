"use client";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const savings = items.reduce((sum, i) => sum + (i.original - i.price) * i.quantity, 0);
  const shipping = totalPrice >= 999 ? 0 : 99;
  const total = totalPrice + shipping;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    state: "Karnataka",
    pin: "",
    country: "India",
    delivery: "standard",
    payment: "card",
    cardNumber: "",
    expiry: "",
    cvv: "",
    cardName: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    // Validate
    if (!form.firstName || !form.email || !form.address1 || !form.city || !form.pin) {
      setError("Please fill in all required fields!");
      return;
    }

    if (items.length === 0) {
      setError("Your cart is empty!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();

      const shippingAddress = `${form.firstName} ${form.lastName}, ${form.address1}${form.address2 ? ", " + form.address2 : ""}, ${form.city}, ${form.state} - ${form.pin}, ${form.country}`;

      // Create order in Supabase
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          buyer_id: user?.id || null,
          total_amount: total,
          shipping_address: shippingAddress,
          payment_method: form.payment,
          payment_status: "paid",
          delivery_status: "processing",
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Clear cart
      clearCart();

      // Redirect to confirmation with order ID
      router.push(`/order-confirmation?orderId=${order.id}&total=${total}&email=${form.email}`);

    } catch (err: any) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white text-sm font-black">T</div>
              <span className="text-xl font-black text-gray-900">Thriftly</span>
            </Link>
            <span className="text-xs text-emerald-600 font-semibold">🔒 Secure Checkout</span>
          </div>
        </header>
        <div className="max-w-2xl mx-auto px-6 py-24 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Your cart is empty</h2>
          <Link href="/browse">
            <button className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition mt-4">
              Browse Items
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* Minimal Navbar */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white text-sm font-black">T</div>
            <span className="text-xl font-black text-gray-900">Thriftly</span>
          </Link>
          <span className="text-xs text-emerald-600 font-semibold">🔒 Secure Checkout</span>
        </div>
      </header>

      {/* Steps */}
      <div className="bg-white border-b border-gray-100 py-4">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center justify-center gap-2">
            {[
              { step: 1, label: "Cart", done: true },
              { step: 2, label: "Delivery", active: true },
              { step: 3, label: "Payment", done: false },
              { step: 4, label: "Confirm", done: false },
            ].map((s, i) => (
              <div key={s.step} className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${s.done ? "bg-emerald-600 text-white" : s.active ? "bg-gray-900 text-white" : "bg-gray-200 text-gray-400"}`}>
                    {s.done ? "✓" : s.step}
                  </div>
                  <span className={`text-xs font-semibold ${s.active ? "text-gray-900" : s.done ? "text-emerald-600" : "text-gray-400"}`}>{s.label}</span>
                </div>
                {i < 3 && <span className="text-gray-300 text-xs mx-1">——</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="max-w-5xl mx-auto px-6 pt-4">
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl font-medium">
            ⚠️ {error}
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Left — Forms */}
          <div className="flex-1 space-y-5">

            {/* Contact Info */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-base font-black text-gray-900 mb-5">Contact Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">First Name *</label>
                  <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="Priya" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Last Name</label>
                  <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Sharma" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Email *</label>
                  <input name="email" value={form.email} onChange={handleChange} type="email" placeholder="you@example.com" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Phone</label>
                  <input name="phone" value={form.phone} onChange={handleChange} placeholder="98765 43210" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 transition" />
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-base font-black text-gray-900 mb-5">Delivery Address</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Address Line 1 *</label>
                  <input name="address1" value={form.address1} onChange={handleChange} placeholder="House no, Street name" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Address Line 2</label>
                  <input name="address2" value={form.address2} onChange={handleChange} placeholder="Apartment, area, landmark" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 transition" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-600 mb-1.5 block">City *</label>
                    <input name="city" value={form.city} onChange={handleChange} placeholder="Mumbai" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 transition" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-600 mb-1.5 block">State</label>
                    <select name="state" value={form.state} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 bg-white">
                      {["Karnataka", "Maharashtra", "Tamil Nadu", "Delhi", "Gujarat", "Rajasthan", "West Bengal", "Telangana", "Kerala", "Uttar Pradesh"].map(s => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-600 mb-1.5 block">PIN Code *</label>
                    <input name="pin" value={form.pin} onChange={handleChange} placeholder="400001" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 transition" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-600 mb-1.5 block">Country</label>
                    <select name="country" value={form.country} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 bg-white">
                      <option>India</option>
                      <option>United States</option>
                      <option>United Kingdom</option>
                      <option>Australia</option>
                      <option>Canada</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Method */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-base font-black text-gray-900 mb-4">Delivery Method</h2>
              <div className="space-y-3">
                {[
                  { id: "standard", label: "Standard Delivery", time: "5–7 business days", price: "FREE", badge: "🎉 Free" },
                  { id: "express", label: "Express Delivery", time: "2–3 business days", price: "₹149", badge: null },
                  { id: "overnight", label: "Overnight Delivery", time: "Next business day", price: "₹299", badge: "⚡ Fast" },
                ].map((method) => (
                  <label key={method.id} className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition ${form.delivery === method.id ? "border-emerald-500 bg-emerald-50" : "border-gray-200 hover:border-emerald-300"}`}>
                    <input type="radio" name="delivery" value={method.id} checked={form.delivery === method.id} onChange={handleChange} className="w-4 h-4 accent-emerald-600" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-gray-900">{method.label}</p>
                        {method.badge && <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">{method.badge}</span>}
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{method.time}</p>
                    </div>
                    <span className={`text-sm font-black ${method.price === "FREE" ? "text-emerald-600" : "text-gray-900"}`}>{method.price}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-base font-black text-gray-900 mb-4">Payment Method</h2>
              <div className="space-y-3 mb-5">
                {[
                  { id: "card", label: "Credit / Debit Card", icon: "💳" },
                  { id: "upi", label: "UPI (GPay, PhonePe, Paytm)", icon: "📱" },
                  { id: "netbanking", label: "Net Banking", icon: "🏦" },
                  { id: "cod", label: "Cash on Delivery", icon: "💵" },
                ].map((method) => (
                  <label key={method.id} className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition ${form.payment === method.id ? "border-emerald-500 bg-emerald-50" : "border-gray-200 hover:border-emerald-300"}`}>
                    <input type="radio" name="payment" value={method.id} checked={form.payment === method.id} onChange={handleChange} className="w-4 h-4 accent-emerald-600" />
                    <span className="text-lg">{method.icon}</span>
                    <span className="text-sm font-bold text-gray-800">{method.label}</span>
                  </label>
                ))}
              </div>

              {form.payment === "card" && (
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-600 mb-1.5 block">Card Number</label>
                    <input name="cardNumber" value={form.cardNumber} onChange={handleChange} placeholder="1234  5678  9012  3456" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 transition bg-white" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-600 mb-1.5 block">Expiry Date</label>
                      <input name="expiry" value={form.expiry} onChange={handleChange} placeholder="MM / YY" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 transition bg-white" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-600 mb-1.5 block">CVV</label>
                      <input name="cvv" value={form.cvv} onChange={handleChange} type="password" placeholder="•••" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 transition bg-white" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-600 mb-1.5 block">Name on Card</label>
                    <input name="cardName" value={form.cardName} onChange={handleChange} placeholder="Priya Sharma" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 transition bg-white" />
                  </div>
                </div>
              )}

              {form.payment === "upi" && (
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">UPI ID</label>
                  <input placeholder="yourname@upi" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 transition bg-white" />
                </div>
              )}
            </div>
          </div>

          {/* Right — Order Summary */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-24">
              <h2 className="text-base font-black text-gray-900 mb-4">Order Summary</h2>

              {/* Items */}
              <div className="space-y-3 mb-4 max-h-52 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-xl shrink-0">{item.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-800 truncate">{item.name}</p>
                      <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-xs font-black text-emerald-700 shrink-0">₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2.5 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Subtotal</span>
                  <span className="text-sm font-semibold">₹{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Savings</span>
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
                <p className="text-xs text-emerald-600 font-semibold mt-1">You're saving ₹{savings.toLocaleString()}! 🎉</p>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full bg-emerald-600 text-white py-4 rounded-2xl text-sm font-black hover:bg-emerald-700 transition shadow-sm mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Placing Order..." : `🔒 Place Order — ₹${total.toLocaleString()}`}
              </button>

              <div className="bg-gray-50 rounded-xl p-3 space-y-1.5 border border-gray-100">
                {["🔒 256-bit SSL Encryption", "✅ Verified Seller", "↩️ 7-day Return Policy", "💬 24/7 Support"].map(t => (
                  <p key={t} className="text-xs text-gray-500">{t}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}