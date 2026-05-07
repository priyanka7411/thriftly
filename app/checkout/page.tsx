"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// Stripe Payment Form Component
function StripeForm({ onSuccess, onError, total }: { onSuccess: (id: string) => void; onError: (e: string) => void; total: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });
    if (error) {
      onError(error.message || "Payment failed");
    } else if (paymentIntent?.status === "succeeded") {
      onSuccess(paymentIntent.id);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement className="mb-4" />
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-emerald-600 text-white py-4 rounded-2xl text-sm font-black hover:bg-emerald-700 transition disabled:opacity-50"
      >
        {loading ? "Processing..." : `🔒 Pay ₹${total.toLocaleString()}`}
      </button>
    </form>
  );
}

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();

  // Store snapshot of cart before payment
  const [savedItems, setSavedItems] = useState<any[]>([]);
  const [savedTotal, setSavedTotal] = useState(0);

  const shipping = totalPrice >= 999 ? 0 : 99;
  const total = totalPrice + shipping;
  const savings = items.reduce((sum, i) => sum + (i.original - i.price) * i.quantity, 0);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [clientSecret, setClientSecret] = useState("");

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    address1: "", address2: "", city: "", state: "Karnataka",
    pin: "", country: "India", delivery: "standard",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Pre-fill email if user is logged in
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) {
        setForm(prev => ({ ...prev, email: data.user!.email! }));
      }
    });
  }, []);

const handleContinueToPayment = async () => {
  setError("");

  if (!form.firstName.trim()) { setError("First name is required!"); return; }
  if (!form.email.trim()) { setError("Email is required!"); return; }
  if (!form.address1.trim()) { setError("Address is required!"); return; }
  if (!form.city.trim()) { setError("City is required!"); return; }
  if (!form.pin.trim()) { setError("PIN code is required!"); return; }
  if (items.length === 0) { setError("Your cart is empty!"); return; }

  // Calculate total DIRECTLY from items — don't trust totalPrice variable
  const calculatedSubtotal = items.reduce(
  (sum, i) =>
    sum +
    (Number(i.price) || 0) *
    (Number(i.quantity) || 0),
  0
);

const calculatedShipping =
  form.delivery === "express"
    ? 149
    : form.delivery === "overnight"
    ? 299
    : calculatedSubtotal >= 999
    ? 0
    : 99;

const calculatedTotal = calculatedSubtotal + calculatedShipping;

console.log("Checkout Debug");
console.log("Items:", items);
console.log("Subtotal:", calculatedSubtotal);
console.log("Shipping:", calculatedShipping);
console.log("Total:", calculatedTotal);

  console.log("Items:", items.length, "Subtotal:", calculatedSubtotal, "Total:", calculatedTotal);

  if (
  typeof calculatedTotal !== "number" ||
  isNaN(calculatedTotal) ||
  calculatedTotal <= 0
) {
  setError("Cart total is invalid. Please go back to cart.");
  return;
}

  setLoading(true);

  try {
    const currentItems = items.map(i => ({
  id: i.id,
  name: i.name,
  price: Number(i.price) || 0,
  original: Number(i.original) || 0,
  emoji: i.emoji,
  quantity: Number(i.quantity) || 0,
}));
    setSavedItems(currentItems);
    setSavedTotal(calculatedTotal);

    const res = await fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: calculatedTotal }),
    });

    const data = await res.json();
    if (data.error) throw new Error(data.error);
    if (!data.clientSecret) throw new Error("No client secret returned");

    setClientSecret(data.clientSecret);
    setStep(2);
  } catch (err: any) {
    setError(err.message || "Something went wrong.");
  }

  setLoading(false);
};

  const handlePaymentSuccess = async (paymentIntentId: string) => {
  try {
    setError("");
    const { data: { user } } = await supabase.auth.getUser();

    const shippingAddress = `${form.firstName} ${form.lastName}, ${form.address1}${form.address2 ? ", " + form.address2 : ""}, ${form.city}, ${form.state} - ${form.pin}, ${form.country}`;

    const orderTotal = savedTotal > 0 ? savedTotal : total;
    const orderItems = savedItems.length > 0 ? savedItems : items;

    if (!orderTotal || orderTotal <= 0) {
      throw new Error("Order total is invalid");
    }

    // Create order
    const res = await fetch("/api/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        buyer_id: user?.id || null,
        total_amount: orderTotal,
        shipping_address: shippingAddress,
        payment_method: `stripe_${paymentIntentId}`,
        items: orderItems.map(i => ({
          id: i.id,
          quantity: i.quantity,
          price: i.price,
        })),
      }),
    });

    const data = await res.json();
    if (data.error) throw new Error(data.error);

    // Send confirmation email
    try {
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: form.email,
          subject: `Order Confirmed! #TH-${data.orderId} 🎉`,
          orderId: data.orderId,
          total: orderTotal,
          name: form.firstName,
          items: orderItems.map(i => ({
            name: i.name,
            price: i.price,
            quantity: i.quantity,
          })),
        }),
      });
      console.log("Email sent!");
    } catch (emailErr) {
      // Don't fail the order if email fails
      console.error("Email failed:", emailErr);
    }

    clearCart();
    router.push(`/order-confirmation?orderId=${data.orderId}&total=${orderTotal}&email=${encodeURIComponent(form.email)}`);

  } catch (err: any) {
    console.error("Order error:", err);
    setError(`Order failed: ${err.message}`);
  }
};

  // Redirect if cart empty and not in payment step
  if (items.length === 0 && step === 1) {
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
          <h2 className="text-2xl font-black text-gray-900 mb-4">Your cart is empty</h2>
          <Link href="/browse">
            <button className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition">
              Browse Items
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // Display items — use saved snapshot on step 2
  const displayItems = step === 2 && savedItems.length > 0 ? savedItems : items;
  const displayTotal = step === 2 && savedTotal > 0 ? savedTotal : total;
  const displaySavings = step === 2 && savedItems.length > 0
    ? savedItems.reduce((sum, i) => sum + (i.original - i.price) * i.quantity, 0)
    : savings;

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

      {/* Steps */}
      <div className="bg-white border-b border-gray-100 py-4">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-center gap-2">
          {[
            { num: 1, label: "Details" },
            { num: 2, label: "Payment" },
            { num: 3, label: "Confirm" },
          ].map((s, i) => (
            <div key={s.num} className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${step > s.num ? "bg-emerald-600 text-white" : step === s.num ? "bg-gray-900 text-white" : "bg-gray-200 text-gray-400"}`}>
                  {step > s.num ? "✓" : s.num}
                </div>
                <span className={`text-xs font-semibold ${step > s.num ? "text-emerald-600" : step === s.num ? "text-gray-900" : "text-gray-400"}`}>{s.label}</span>
              </div>
              {i < 2 && <span className="text-gray-300 text-xs mx-1">——</span>}
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="max-w-5xl mx-auto px-6 pt-4">
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl font-medium">⚠️ {error}</div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Left */}
          <div className="flex-1">

            {/* Step 1 */}
            {step === 1 && (
              <div className="space-y-5">
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h2 className="text-base font-black text-gray-900 mb-5">Contact Information</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-600 mb-1.5 block">First Name *</label>
                      <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="Priya" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 transition" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-600 mb-1.5 block">Last Name</label>
                      <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Sharma" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 transition" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-600 mb-1.5 block">Email *</label>
                      <input name="email" value={form.email} onChange={handleChange} type="email" placeholder="you@example.com" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 transition" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-600 mb-1.5 block">Phone</label>
                      <input name="phone" value={form.phone} onChange={handleChange} placeholder="98765 43210" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 transition" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h2 className="text-base font-black text-gray-900 mb-5">Delivery Address</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-gray-600 mb-1.5 block">Address Line 1 *</label>
                      <input name="address1" value={form.address1} onChange={handleChange} placeholder="House no, Street name" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 transition" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-600 mb-1.5 block">Address Line 2</label>
                      <input name="address2" value={form.address2} onChange={handleChange} placeholder="Apartment, landmark" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 transition" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-gray-600 mb-1.5 block">City *</label>
                        <input name="city" value={form.city} onChange={handleChange} placeholder="Mumbai" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 transition" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-600 mb-1.5 block">State</label>
                        <select name="state" value={form.state} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 bg-white">
                          {["Karnataka", "Maharashtra", "Tamil Nadu", "Delhi", "Gujarat", "Rajasthan", "Telangana", "Kerala", "West Bengal", "Uttar Pradesh"].map(s => <option key={s}>{s}</option>)}
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

                <button
                  onClick={handleContinueToPayment}
                  disabled={loading}
                  className="w-full bg-emerald-600 text-white py-4 rounded-2xl text-sm font-black hover:bg-emerald-700 transition disabled:opacity-50"
                >
                  {loading ? "⏳ Processing..." : "Continue to Payment →"}
                </button>
              </div>
            )}

            {/* Step 2 — Payment */}
            {step === 2 && clientSecret && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-base font-black text-gray-900">Payment</h2>
                  <button onClick={() => setStep(1)} className="text-xs text-emerald-600 font-semibold hover:underline">← Back</button>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 mb-5 flex items-center gap-2">
                  <span>🔒</span>
                  <p className="text-xs text-emerald-700 font-semibold">Your payment is secured by Stripe with 256-bit SSL encryption</p>
                </div>
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    appearance: { theme: "stripe", variables: { colorPrimary: "#059669" } },
                  }}
                >
                  <StripeForm
                    total={displayTotal}
                    onSuccess={handlePaymentSuccess}
                    onError={(err) => setError(err)}
                  />
                </Elements>
                <p className="text-center text-xs text-gray-400 mt-4">
                  Test card: <span className="font-mono font-bold">4242 4242 4242 4242</span> · Any future date · Any CVV
                </p>
              </div>
            )}
          </div>

          {/* Right — Order Summary */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-24">
              <h2 className="text-base font-black text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4 max-h-52 overflow-y-auto">
                {displayItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-xl shrink-0">
                      {item.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-800 truncate">{item.name}</p>
                      <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-xs font-black text-emerald-700 shrink-0">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-4 space-y-2.5 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Subtotal</span>
                  <span className="text-sm font-semibold">₹{(displayTotal - (displayTotal >= 999 ? 0 : 99)).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Savings</span>
                  <span className="text-sm font-bold text-emerald-600">−₹{displaySavings.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Shipping</span>
                  <span className="text-sm font-bold text-emerald-600">FREE 🎉</span>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-4 mb-5">
                <div className="flex justify-between">
                  <span className="text-base font-black text-gray-900">Total</span>
                  <span className="text-base font-black text-gray-900">₹{displayTotal.toLocaleString()}</span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 space-y-1.5 border border-gray-100">
                {["🔒 256-bit SSL Encryption", "✅ Verified Sellers", "↩️ 7-day Return Policy", "💬 24/7 Support"].map(t => (
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