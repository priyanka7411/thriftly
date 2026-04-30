import Navbar from "@/components/Navbar";
import Link from "next/link";

const steps = [
  {
    icon: "🔍",
    title: "Browse & Discover",
    desc: "Search through thousands of pre-loved items from verified sellers across India and the world. Filter by category, price, condition and more.",
    color: "bg-blue-50 border-blue-200",
  },
  {
    icon: "🛒",
    title: "Add to Cart & Buy",
    desc: "Found something you love? Add it to cart and checkout securely using cards, UPI, net banking or cash on delivery.",
    color: "bg-emerald-50 border-emerald-200",
  },
  {
    icon: "🚚",
    title: "Fast Delivery",
    desc: "Sellers ship your order within 2 days. Track your order in real time from your buyer dashboard.",
    color: "bg-orange-50 border-orange-200",
  },
  {
    icon: "⭐",
    title: "Review & Repeat",
    desc: "Rate your purchase and seller after delivery. Help build a trusted community of thrift lovers!",
    color: "bg-purple-50 border-purple-200",
  },
];

const sellerSteps = [
  { icon: "📝", title: "Apply as Seller", desc: "Fill a quick form to become a verified Thriftly seller. We review and approve within 24 hours." },
  { icon: "📸", title: "List Your Items", desc: "Upload photos, set your price, add condition and description. List in under 2 minutes!" },
  { icon: "💰", title: "Get Paid", desc: "Once your item sells, we release payment to your bank account within 3 business days." },
];

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />

      {/* Hero */}
      <section className="bg-white border-b border-gray-100 py-16 text-center px-6">
        <span className="inline-block bg-emerald-50 text-emerald-700 text-xs font-bold px-4 py-1.5 rounded-full border border-emerald-200 mb-4">
          🌿 Simple & Transparent
        </span>
        <h1 className="text-4xl font-black text-gray-900 mb-3">How Thriftly Works</h1>
        <p className="text-gray-500 text-base max-w-md mx-auto">
          Buying and selling pre-loved items has never been easier. Here's everything you need to know.
        </p>
      </section>

      {/* Buyer Steps */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-black text-gray-900 text-center mb-2">For Buyers 🛍️</h2>
        <p className="text-sm text-gray-400 text-center mb-10">Find amazing deals in 4 simple steps</p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div key={i} className={`rounded-2xl border p-6 text-center ${step.color}`}>
              <div className="text-4xl mb-4">{step.icon}</div>
              <div className="w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-black mx-auto mb-3">{i + 1}</div>
              <h3 className="text-sm font-black text-gray-900 mb-2">{step.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/browse">
            <button className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition">
              🛍️ Start Shopping Now →
            </button>
          </Link>
        </div>
      </section>

      {/* Seller Steps */}
      <section className="bg-white border-y border-gray-100 py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-black text-gray-900 text-center mb-2">For Sellers 💼</h2>
          <p className="text-sm text-gray-400 text-center mb-10">Turn your unused items into cash in 3 steps</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sellerSteps.map((step, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl border border-gray-200 p-6 text-center">
                <div className="text-4xl mb-4">{step.icon}</div>
                <div className="w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-black mx-auto mb-3">{i + 1}</div>
                <h3 className="text-sm font-black text-gray-900 mb-2">{step.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/signup">
              <button className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-gray-800 transition">
                💼 Become a Seller →
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-black text-gray-900 text-center mb-10">FAQs ❓</h2>
        <div className="space-y-4">
          {[
            ["Is it free to sign up?", "Yes! Creating a Thriftly account is completely free for both buyers and sellers."],
            ["How does Thriftly make money?", "We charge a small 10% commission on each successful sale. No listing fees, no hidden charges."],
            ["Is my payment secure?", "Absolutely. All payments are processed via Stripe with 256-bit SSL encryption."],
            ["What if my item doesn't arrive?", "We have full buyer protection. If your item doesn't arrive or isn't as described, you get a full refund."],
            ["How long does shipping take?", "Standard delivery takes 5-7 business days. Express (2-3 days) and overnight options are also available."],
            ["Can I sell from outside India?", "Yes! Thriftly is a global marketplace. Sellers from anywhere can list items."],
          ].map(([q, a]) => (
            <div key={q} className="bg-white rounded-2xl border border-gray-200 p-5">
              <p className="text-sm font-black text-gray-900 mb-2">{q}</p>
              <p className="text-sm text-gray-500 leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-emerald-600 py-14 px-6 text-center">
        <h2 className="text-3xl font-black text-white mb-3">Ready to start? 🚀</h2>
        <p className="text-emerald-100 text-sm mb-8 max-w-md mx-auto">Join thousands of buyers and sellers on Thriftly today. It's free!</p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/signup">
            <button className="px-8 py-3 bg-white text-emerald-700 rounded-xl font-black text-sm hover:bg-emerald-50 transition">
              Create Free Account →
            </button>
          </Link>
          <Link href="/browse">
            <button className="px-8 py-3 border-2 border-white text-white rounded-xl font-black text-sm hover:bg-emerald-700 transition">
              Browse Items
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 px-6 text-center">
        <p className="text-xs text-gray-400">© 2025 Thriftly. Made with ❤️ in India 🇮🇳 for the World 🌍</p>
      </footer>
    </div>
  );
}