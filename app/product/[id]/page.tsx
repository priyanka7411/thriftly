"use client";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  original_price: number;
  condition: string;
  category: string;
  images: string[];
  location: string;
  views: number;
  seller_id: string;
  created_at: string;
}

const conditionStyle: Record<string, string> = {
  "Like New": "bg-emerald-50 text-emerald-700 border border-emerald-200",
  "Good": "bg-blue-50 text-blue-700 border border-blue-200",
  "Fair": "bg-amber-50 text-amber-700 border border-amber-200",
};

export default function ProductDetail() {
  const { addToCart } = useCart();
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");
  const [messageSent, setMessageSent] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);

    // Fetch product
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      setLoading(false);
      return;
    }

    setProduct(data);

    // Update view count
    await supabase
      .from("products")
      .update({ views: (data.views || 0) + 1 })
      .eq("id", id);

    // Fetch related products
    const { data: related } = await supabase
      .from("products")
      .select("*")
      .eq("category", data.category)
      .neq("id", id)
      .eq("status", "active")
      .limit(4);

    if (related) setRelatedProducts(related);
    setLoading(false);
  };

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        original: product.original_price,
        emoji: product.images?.[0] || "🛍️",
        seller: product.seller_id || "seller",
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

  const discountPercent = product
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row gap-8 animate-pulse">
            <div className="flex-1">
              <div className="bg-gray-200 rounded-3xl h-96 mb-3"></div>
              <div className="flex gap-3">
                {Array(4).fill(0).map((_, i) => (
                  <div key={i} className="flex-1 bg-gray-200 rounded-2xl h-20"></div>
                ))}
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <div className="bg-gray-200 h-6 rounded w-1/3"></div>
              <div className="bg-gray-200 h-10 rounded w-2/3"></div>
              <div className="bg-gray-200 h-24 rounded"></div>
              <div className="bg-gray-200 h-12 rounded"></div>
              <div className="bg-gray-200 h-12 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Product not found
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans">
        <Navbar />
        <div className="max-w-2xl mx-auto px-6 py-24 text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Product not found</h2>
          <p className="text-gray-400 text-sm mb-6">This item may have been sold or removed.</p>
          <Link href="/browse">
            <button className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition">
              Browse Other Items
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

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
          <Link href="/" className="hover:text-emerald-600">Home</Link>
          <span>›</span>
          <Link href="/browse" className="hover:text-emerald-600">Browse</Link>
          <span>›</span>
          <Link href="/browse" className="hover:text-emerald-600">{product.category}</Link>
          <span>›</span>
          <span className="text-gray-700 font-medium truncate max-w-xs">{product.name}</span>
        </div>

        {/* Main Product */}
        <div className="flex flex-col md:flex-row gap-8 mb-12">

          {/* Images */}
          <div className="flex-1">
            <div className="bg-white rounded-3xl border border-gray-200 h-96 flex items-center justify-center mb-3 relative overflow-hidden group">
              <span className="text-9xl group-hover:scale-110 transition duration-300">
                {product.images?.[selectedImage] || "🛍️"}
              </span>
              <span className="absolute top-4 right-4 bg-red-500 text-white text-sm font-black px-3 py-1 rounded-xl">
                {discountPercent}% off
              </span>
            </div>
            <div className="flex gap-3">
              {(product.images || ["🛍️"]).map((img, i) => (
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
              <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full font-semibold">
                {product.category}
              </span>
            </div>

            <h1 className="text-2xl font-black text-gray-900 mb-2">{product.name}</h1>

            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs text-gray-400">👁 {product.views} views</span>
              <span className="text-xs text-gray-300">·</span>
              <span className="text-xs text-gray-400">
                Listed {new Date(product.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>

            {/* Price */}
            <div className="bg-gray-50 rounded-2xl p-4 mb-4 border border-gray-100">
              <div className="flex items-baseline gap-3 mb-1">
                <span className="text-3xl font-black text-emerald-700">₹{product.price.toLocaleString()}</span>
                <span className="text-lg text-gray-400 line-through">₹{product.original_price.toLocaleString()}</span>
                <span className="bg-red-100 text-red-600 text-sm font-black px-2 py-0.5 rounded-lg">{discountPercent}% off</span>
              </div>
              <p className="text-xs text-gray-400">
                You save <span className="text-emerald-700 font-bold">₹{(product.original_price - product.price).toLocaleString()}</span>!
              </p>
            </div>

            {/* Condition */}
            <div className="flex items-center gap-3 mb-3">
              <span className="text-sm font-semibold text-gray-600">Condition:</span>
              <span className={`text-sm font-bold px-3 py-1 rounded-full ${conditionStyle[product.condition] || "bg-gray-100 text-gray-600"}`}>
                {product.condition}
              </span>
            </div>

            {/* Location */}
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

            {/* Buyer Protection */}
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

          {/* Description */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-4">
              <h3 className="text-base font-black text-gray-900 mb-3">About this item</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {product.description || "No description provided."}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="text-base font-black text-gray-900 mb-4">Item Details</h3>
              <div className="divide-y divide-gray-100">
                {[
                  ["Category", product.category],
                  ["Condition", product.condition],
                  ["Location", product.location],
                  ["Listed", new Date(product.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })],
                  ["Views", `${product.views} people viewed this`],
                ].map(([key, val]) => (
                  <div key={key} className="flex justify-between py-2.5">
                    <span className="text-sm text-gray-500 font-medium">{key}</span>
                    <span className="text-sm text-gray-800 font-semibold">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Seller Card */}
          <div className="w-full md:w-72 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-200 p-5 sticky top-24">
              <h3 className="text-base font-black text-gray-900 mb-4">About the Seller</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center text-xl font-black">S</div>
                <div>
                  <p className="text-sm font-black text-gray-900">Verified Seller</p>
                  <p className="text-xs text-gray-400">Thriftly Member</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 mb-4">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                <span className="text-xs text-gray-500 font-medium">Usually responds within 1 hour</span>
              </div>

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
                  <p className="text-xs font-bold text-emerald-700">✅ Message sent!</p>
                </div>
              )}

              <Link href="/seller/profile">
                <button className="w-full border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-50 transition">
                  👤 View Profile
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <h2 className="text-xl font-black text-gray-900 mb-5">You might also like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((item) => (
                <Link href={`/product/${item.id}`} key={item.id}>
                  <div className="bg-white rounded-2xl border border-gray-200 hover:border-emerald-300 hover:shadow-lg transition cursor-pointer group overflow-hidden">
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 h-36 flex items-center justify-center">
                      <span className="text-5xl group-hover:scale-110 transition">{item.images?.[0] || "🛍️"}</span>
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-bold text-gray-900 mb-1 truncate">{item.name}</p>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-black text-emerald-700">₹{item.price.toLocaleString()}</span>
                        <span className="text-xs text-gray-400 line-through">₹{item.original_price.toLocaleString()}</span>
                      </div>
                      <span className="text-xs bg-red-50 text-red-600 font-bold px-1.5 py-0.5 rounded-md">
                        {Math.round(((item.original_price - item.price) / item.original_price) * 100)}% off
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {relatedProducts.length === 0 && !loading && (
          <div className="text-center py-8">
            <Link href="/browse">
              <button className="px-8 py-3 border-2 border-emerald-600 text-emerald-700 font-bold text-sm rounded-xl hover:bg-emerald-50 transition">
                Browse More Items →
              </button>
            </Link>
          </div>
        )}

      </div>

      {/* Mobile sticky bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 flex gap-3 md:hidden z-50">
        <button onClick={handleAddToCart} className="flex-1 bg-emerald-600 text-white py-3 rounded-xl text-sm font-black">🛒 Add to Cart</button>
        <button onClick={handleBuyNow} className="flex-1 bg-gray-900 text-white py-3 rounded-xl text-sm font-black">⚡ Buy Now</button>
      </div>
    </div>
  );
}