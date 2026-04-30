import Navbar from "@/components/Navbar";
import Link from "next/link";


const cartItems = [
  { id: 1, name: "Banarasi Silk Saree", price: 1200, original: 4500, emoji: "🥻", seller: "ethnic_finds", condition: "Like New" },
  { id: 3, name: "Nike Air Max 90", price: 3500, original: 9000, emoji: "👟", seller: "sneaker_vault", condition: "Like New" },
  { id: 9, name: "Harry Potter Box Set", price: 550, original: 1800, emoji: "📚", seller: "bookworm99", condition: "Good" },
];

const subtotal = cartItems.reduce((sum, i) => sum + i.price, 0);
const savings = cartItems.reduce((sum, i) => sum + (i.original - i.price), 0);
const shipping = 0;
const total = subtotal + shipping;

export default function Checkout() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* Navbar — minimal for checkout */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white text-sm font-black">T</div>
            <span className="text-xl font-black text-gray-900">Thriftly</span>
          </Link>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="text-emerald-600 font-bold">🔒 Secure Checkout</span>
          </div>
        </div>
      </header>

      {/* Checkout Steps */}
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

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Left — Forms */}
          <div className="flex-1 space-y-5">

            {/* Contact Info */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-black text-gray-900">Contact Information</h2>
                <span className="text-xs text-emerald-600 font-semibold cursor-pointer hover:underline">Login for faster checkout</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">First Name</label>
                  <input type="text" placeholder="Priya" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Last Name</label>
                  <input type="text" placeholder="Sharma" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Email</label>
                  <input type="email" placeholder="you@example.com" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Phone Number</label>
                  <div className="flex gap-2">
                    <select className="border border-gray-200 rounded-xl px-2 py-3 text-sm outline-none focus:border-emerald-500 bg-white text-gray-700">
                      <option>🇮🇳 +91</option>
                      <option>🇺🇸 +1</option>
                      <option>🇬🇧 +44</option>
                    </select>
                    <input type="tel" placeholder="98765 43210" className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition" />
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-base font-black text-gray-900 mb-5">Delivery Address</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Address Line 1</label>
                  <input type="text" placeholder="House no, Street name" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Address Line 2 (Optional)</label>
                  <input type="text" placeholder="Apartment, area, landmark" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-600 mb-1.5 block">City</label>
                    <input type="text" placeholder="Mumbai" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 transition" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-600 mb-1.5 block">State</label>
                    <select className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 bg-white text-gray-700">
                      <option>Select state</option>
                      {["Maharashtra", "Karnataka", "Tamil Nadu", "Delhi", "Gujarat", "Rajasthan", "West Bengal", "Telangana", "Kerala", "Uttar Pradesh"].map(s => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-600 mb-1.5 block">PIN Code</label>
                    <input type="text" placeholder="400001" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 transition" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-600 mb-1.5 block">Country</label>
                    <select className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 bg-white text-gray-700">
                      <option>🇮🇳 India</option>
                      <option>🇺🇸 United States</option>
                      <option>🇬🇧 United Kingdom</option>
                      <option>🇦🇺 Australia</option>
                      <option>🇨🇦 Canada</option>
                    </select>
                  </div>
                </div>

                {/* Save address checkbox */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-emerald-600" />
                  <span className="text-xs text-gray-500">Save this address for future orders</span>
                </label>
              </div>
            </div>

            {/* Delivery Method */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-base font-black text-gray-900 mb-4">Delivery Method</h2>
              <div className="space-y-3">
                {[
                  { id: "standard", label: "Standard Delivery", time: "5–7 business days", price: "FREE", badge: "🎉 Free", selected: true },
                  { id: "express", label: "Express Delivery", time: "2–3 business days", price: "₹149", badge: null, selected: false },
                  { id: "overnight", label: "Overnight Delivery", time: "Next business day", price: "₹299", badge: "⚡ Fast", selected: false },
                ].map((method) => (
                  <label key={method.id} className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition ${method.selected ? "border-emerald-500 bg-emerald-50" : "border-gray-200 hover:border-emerald-300"}`}>
                    <input type="radio" name="delivery" defaultChecked={method.selected} className="w-4 h-4 accent-emerald-600" />
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
                  { id: "card", label: "Credit / Debit Card", icon: "💳", selected: true },
                  { id: "upi", label: "UPI (GPay, PhonePe, Paytm)", icon: "📱", selected: false },
                  { id: "netbanking", label: "Net Banking", icon: "🏦", selected: false },
                  { id: "cod", label: "Cash on Delivery", icon: "💵", selected: false },
                ].map((method) => (
                  <label key={method.id} className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition ${method.selected ? "border-emerald-500 bg-emerald-50" : "border-gray-200 hover:border-emerald-300"}`}>
                    <input type="radio" name="payment" defaultChecked={method.selected} className="w-4 h-4 accent-emerald-600" />
                    <span className="text-lg">{method.icon}</span>
                    <span className="text-sm font-bold text-gray-800">{method.label}</span>
                  </label>
                ))}
              </div>

              {/* Card Form */}
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Card Number</label>
                  <input type="text" placeholder="1234  5678  9012  3456" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 transition bg-white" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-600 mb-1.5 block">Expiry Date</label>
                    <input type="text" placeholder="MM / YY" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 transition bg-white" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-600 mb-1.5 block">CVV</label>
                    <input type="password" placeholder="•••" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 transition bg-white" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Name on Card</label>
                  <input type="text" placeholder="Priya Sharma" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 transition bg-white" />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-emerald-600" />
                  <span className="text-xs text-gray-500">Save card for future payments</span>
                </label>
              </div>
            </div>

          </div>

          {/* Right — Order Summary */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-24">
              <h2 className="text-base font-black text-gray-900 mb-4">Order Summary</h2>

              {/* Items */}
              <div className="space-y-3 mb-4 max-h-52 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-xl shrink-0">{item.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-800 truncate">{item.name}</p>
                      <p className="text-xs text-gray-400">@{item.seller}</p>
                    </div>
                    <span className="text-xs font-black text-emerald-700 shrink-0">₹{item.price.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2.5 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Subtotal</span>
                  <span className="text-sm font-semibold">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Savings</span>
                  <span className="text-sm font-bold text-emerald-600">−₹{savings.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Shipping</span>
                  <span className="text-sm font-bold text-emerald-600">FREE 🎉</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 mb-5">
                <div className="flex justify-between">
                  <span className="text-base font-black text-gray-900">Total</span>
                  <span className="text-base font-black text-gray-900">₹{total.toLocaleString()}</span>
                </div>
                <p className="text-xs text-emerald-600 font-semibold mt-1">You're saving ₹{savings.toLocaleString()}! 🎉</p>
              </div>

              {/* Place Order */}
              <button className="w-full bg-emerald-600 text-white py-4 rounded-2xl text-sm font-black hover:bg-emerald-700 transition shadow-sm shadow-emerald-100 mb-3">
                🔒 Place Order — ₹{total.toLocaleString()}
              </button>

              <p className="text-center text-xs text-gray-400 mb-4">
                By placing this order you agree to our{" "}
                <a href="#" className="text-emerald-600 hover:underline">Terms</a> &{" "}
                <a href="#" className="text-emerald-600 hover:underline">Refund Policy</a>
              </p>

              {/* Trust */}
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