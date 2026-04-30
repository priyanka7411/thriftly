"use client";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { useRouter } from "next/navigation";

const product = {
  id: 1,
  name: "Banarasi Silk Saree",
  price: "₹1,200",
  priceNum: 1200,
  original: "₹4,500",
  originalNum: 4500,
  tag: "73% off",
  condition: "Like New",
  seller: "ethnic_finds",
  sellerName: "Ethnic Finds Store",
  sellerRating: 4.9,
  sellerSales: 134,
  location: "🇮🇳 Varanasi",
  category: "Ethnic Wear",
  emoji: "🥻",
  rating: 4.9,
  reviews: 38,
  views: 214,
  stock: "2 left",
  urgency: "🔥 Trending",
  description: "Beautiful handwoven Banarasi silk saree in a rich maroon and gold combination. Worn only once for a family event. Comes with original blouse piece. Perfect for weddings, festivals, or special occasions.",
  details: [
    ["Fabric", "Pure Silk"],
    ["Color", "Maroon & Gold"],
    ["Size", "6.3 meters"],
    ["Blouse Piece", "Included"],
    ["Occasion", "Wedding, Festival"],
    ["Condition", "Like New — worn once"],
    ["Listed", "2 days ago"],
  ],
  images: ["🥻", "✨", "🪡", "💎"],
};

const relatedProducts = [
  { id: 6, name: "Kurta Set XL", price: "₹450", original: "₹1,200", emoji: "👘", rating: 4.5, condition: "Good", tag: "62% off" },
  { id: 2, name: "Vintage Denim Jacket", price: "₹899", original: "₹2,999", emoji: "🧥", rating: 4.7, condition: "Good", tag: "70% off" },
  { id: 11, name: "Floral Kurti S/M", price: "₹320", original: "₹999", emoji: "👗", rating: 4.4, condition: "Good", tag: "68% off" },
  { id: 8, name: "Leather Tote Bag", price: "₹1,100", original: "₹3,500", emoji: "👜", rating: 4.7, condition: "Like New", tag: "68% off" },
];

const reviews = [
  { name: "Sneha R.", rating: 5, date: "2 weeks ago", text: "Absolutely gorgeous saree! Exactly as described. Fast shipping!", avatar: "S" },
  { name: "Meera K.", rating: 5, date: "1 month ago", text: "Great quality silk, looks brand new. Very happy with this purchase!", avatar: "M" },
  { name: "Pooja T.", rating: 4, date: "1 month ago", text: "Beautiful saree, slight delay in shipping but overall great.", avatar: "P" },
];

const conditionStyle: Record<string, string> = {
  "Like New": "bg-emerald-50 text-emerald-700 border border-emerald-200",
  "Good": "bg-blue-50 text-blue-700 border border-blue-200",
  "Fair": "bg-amber-50 text-amber-700 border border-amber-200",
};

export default function ProductDetail() {
  const { addToCart } = useCart();
  const router = useRouter();
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");
  const [messageSent, setMessageSent] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.priceNum,
        original: product.originalNum,
        emoji: product.emoji,
        seller: product.seller,
        condition: product.condition,
      });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/checkout");
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    setMessageSent(true);
    setMessage("");
    setTimeout(() => { setMessageSent(false); setShowMessage(false); }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
          <Link href="/" className="hover:text-emerald-600">Home</Link>
          <span>›</span>
          <Link href="/browse" className="hover:text-emerald-600">Browse</Link>
          <span>›</span>
          <Link href="/browse" className="hover:text-emerald-600">{product.category}</Link>
          <span>›</span>
          <span className="text-gray-700 font-medium">{product.name}</span>
        </div>

        {/* Main */}
        <div className="flex flex-col md:flex-row gap-8 mb-12">

          {/* Images */}
          <div className="flex-1">
            <div className="bg-white rounded-3xl border border-gray-200 h-96 flex items-center justify-center mb-3 relative overflow-hidden group">
              <span className="text-9xl group-hover:scale-110 transition duration-300">{product.images[selectedImage]}</span>
              <span className="absolute top-4 right-4 bg-red-500 text-white text-sm font-black px-3 py-1 rounded-xl">{product.tag}</span>
              <span className="absolute top-4 left-4 bg-black/70 text-white text-xs font-semibold px-3 py-1 rounded-lg">{product.urgency}</span>
            </div>
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`flex-1 bg-white rounded-2xl border h-20 flex items-center justify-center text-3xl hover:border-emerald-400 transition ${selectedImage === i ? "border-emerald-500 shadow-sm" : "border-gray-200"}`}
                >
                  {img}
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 max-w-md">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full font-semibold">{product.category}</span>
              <span className="text-xs text-orange-700 bg-orange-50 border border-orange-200 px-2.5 py-1 rounded-full font-semibold">⚠️ Only {product.stock}!</span>
            </div>

            <h1 className="text-2xl font-black text-gray-900 mb-2">{product.name}</h1>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-0.5">
                {Array(5).fill(0).map((_, i) => (
                  <span key={i} className={`text-sm ${i < Math.floor(product.rating) ? "text-amber-400" : "text-gray-200"}`}>★</span>
                ))}
              </div>
              <span className="text-sm font-bold text-gray-700">{product.rating}</span>
              <span className="text-sm text-gray-400">({product.reviews} reviews)</span>
              <span className="text-xs text-gray-300">·</span>
              <span className="text-xs text-gray-400">👁 {product.views} views</span>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4 mb-4 border border-gray-100">
              <div className="flex items-baseline gap-3 mb-1">
                <span className="text-3xl font-black text-emerald-700">{product.price}</span>
                <span className="text-lg text-gray-400 line-through">{product.original}</span>
                <span className="bg-red-100 text-red-600 text-sm font-black px-2 py-0.5 rounded-lg">{product.tag}</span>
              </div>
              <p className="text-xs text-gray-400">You save <span className="text-emerald-700 font-bold">₹3,300</span>!</p>
            </div>

            <div className="flex items-center gap-3 mb-3">
              <span className="text-sm font-semibold text-gray-600">Condition:</span>
              <span className={`text-sm font-bold px-3 py-1 rounded-full ${conditionStyle[product.condition]}`}>{product.condition}</span>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm text-gray-500">📍 Ships from</span>
              <span className="text-sm font-semibold text-gray-700">{product.location}</span>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-3 mb-5">
              <span className="text-sm font-semibold text-gray-600">Quantity:</span>
              <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 bg-white rounded-lg text-sm font-bold text-gray-600 hover:text-emerald-700 shadow-sm transition">−</button>
                <span className="text-sm font-black text-gray-900 w-6 text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 bg-white rounded-lg text-sm font-bold text-gray-600 hover:text-emerald-700 shadow-sm transition">+</button>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                className={`w-full py-4 rounded-2xl text-sm font-black transition shadow-sm ${added ? "bg-emerald-700 text-white" : "bg-emerald-600 text-white hover:bg-emerald-700"}`}
              >
                {added ? "✅ Added to Cart!" : "🛒 Add to Cart"}
              </button>
              <button
                onClick={handleBuyNow}
                className="w-full bg-gray-900 text-white py-4 rounded-2xl text-sm font-black hover:bg-gray-800 transition"
              >
                ⚡ Buy Now
              </button>
              <button
                onClick={() => setWishlisted(!wishlisted)}
                className={`w-full border-2 py-3 rounded-2xl text-sm font-bold transition ${wishlisted ? "border-red-400 text-red-500 bg-red-50" : "border-gray-200 text-gray-700 hover:border-red-300 hover:text-red-500"}`}
              >
                {wishlisted ? "❤️ Saved to Wishlist!" : "♡ Save to Wishlist"}
              </button>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
              <p className="text-xs font-black text-emerald-800 mb-2">🔒 Buyer Protection Included</p>
              <ul className="space-y-1">
                {["Full refund if item not as described", "Secure payment via Stripe", "24/7 dispute resolution support"].map(i => (
                  <li key={i} className="text-xs text-emerald-700 flex items-center gap-1.5">
                    <span className="text-emerald-500">✓</span> {i}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Description + Seller */}
        <div className="flex flex-col md:flex-row gap-6 mb-12">
          <div className="flex-1">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-4">
              <h3 className="text-base font-black text-gray-900 mb-3">About this item</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="text-base font-black text-gray-900 mb-4">Item Details</h3>
              <div className="divide-y divide-gray-100">
                {product.details.map(([key, val]) => (
                  <div key={key} className="flex justify-between py-2.5">
                    <span className="text-sm text-gray-500 font-medium">{key}</span>
                    <span className="text-sm text-gray-800 font-semibold">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Seller */}
          <div className="w-full md:w-72 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-200 p-5 sticky top-24">
              <h3 className="text-base font-black text-gray-900 mb-4">About the Seller</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center text-xl font-black">E</div>
                <div>
                  <p className="text-sm font-black text-gray-900">{product.sellerName}</p>
                  <p className="text-xs text-gray-400">@{product.seller}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[["⭐", product.sellerRating, "Rating"], ["📦", product.sellerSales, "Sales"], ["📅", "1yr+", "Member"]].map(([icon, val, label]) => (
                  <div key={label as string} className="bg-gray-50 rounded-xl p-2.5 text-center border border-gray-100">
                    <p className="text-sm">{icon as string}</p>
                    <p className="text-sm font-black text-gray-900">{val as string | number}</p>
                    <p className="text-xs text-gray-400">{label as string}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-1.5 mb-4">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                <span className="text-xs text-gray-500 font-medium">Usually responds within 1 hour</span>
              </div>

              {/* Message Form */}
              {!showMessage && !messageSent && (
                <button
                  onClick={() => setShowMessage(true)}
                  className="w-full border border-emerald-600 text-emerald-700 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-50 transition mb-2"
                >
                  💬 Message Seller
                </button>
              )}

              {showMessage && !messageSent && (
                <div className="mb-2">
                  <textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Hi, is this item still available?"
                    rows={3}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-500 transition resize-none mb-2"
                  />
                  <div className="flex gap-2">
                    <button onClick={handleSendMessage} className="flex-1 bg-emerald-600 text-white py-2 rounded-xl text-xs font-bold hover:bg-emerald-700 transition">Send</button>
                    <button onClick={() => setShowMessage(false)} className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-xl text-xs font-bold hover:bg-gray-50 transition">Cancel</button>
                  </div>
                </div>
              )}

              {messageSent && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 mb-2 text-center">
                  <p className="text-xs font-bold text-emerald-700">✅ Message sent to seller!</p>
                </div>
              )}

              <Link href={`/seller/profile`}>
                <button className="w-full border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-50 transition">
                  👤 View Profile
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <section className="mb-12">
          <div className="mb-5">
            <h2 className="text-xl font-black text-gray-900">Reviews ({product.reviews})</h2>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex gap-0.5">{Array(5).fill(0).map((_, i) => <span key={i} className="text-amber-400 text-sm">★</span>)}</div>
              <span className="text-sm font-bold text-gray-700">{product.rating} out of 5</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {reviews.map((r) => (
              <div key={r.name} className="bg-white rounded-2xl border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xs font-black">{r.avatar}</div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{r.name}</p>
                      <p className="text-xs text-gray-400">{r.date}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">{Array(r.rating).fill(0).map((_, i) => <span key={i} className="text-amber-400 text-xs">★</span>)}</div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{r.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related */}
        <section>
          <h2 className="text-xl font-black text-gray-900 mb-5">You might also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((item) => (
              <Link href={`/product/${item.id}`} key={item.id}>
                <div className="bg-white rounded-2xl border border-gray-200 hover:border-emerald-300 hover:shadow-lg transition cursor-pointer group overflow-hidden">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 h-36 flex items-center justify-center">
                    <span className="text-5xl group-hover:scale-110 transition">{item.emoji}</span>
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-bold text-gray-900 mb-1">{item.name}</p>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-black text-emerald-700">{item.price}</span>
                      <span className="text-xs text-gray-400 line-through">{item.original}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-amber-500 font-bold">★ {item.rating}</span>
                      <span className="text-xs bg-red-50 text-red-600 font-bold px-1.5 py-0.5 rounded-md">{item.tag}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* Mobile sticky bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 flex gap-3 md:hidden z-50">
        <button onClick={handleAddToCart} className="flex-1 bg-emerald-600 text-white py-3 rounded-xl text-sm font-black">🛒 Add to Cart</button>
        <button onClick={handleBuyNow} className="flex-1 bg-gray-900 text-white py-3 rounded-xl text-sm font-black">⚡ Buy Now</button>
      </div>
    </div>
  );
}