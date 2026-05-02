"use client";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface Product {
  id: number;
  name: string;
  price: number;
  original_price: number;
  status: string;
  views: number;
  emoji: string;
  category: string;
  created_at: string;
  images: string[];
  condition: string;
}

const statusStyle: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  sold: "bg-gray-100 text-gray-500 border border-gray-200",
  inactive: "bg-yellow-50 text-yellow-700 border border-yellow-200",
};

const sidebarLinks = [
  { icon: "📊", label: "Overview", href: "/seller" },
  { icon: "📦", label: "My Listings", href: "/seller/listings", active: true },
  { icon: "🛒", label: "Orders", href: "/seller/orders" },
  { icon: "💰", label: "Earnings", href: "/seller/earnings" },
  { icon: "⭐", label: "Reviews", href: "/seller/reviews" },
  { icon: "👤", label: "Public Profile", href: "/seller/profile" },
  { icon: "⚙️", label: "Settings", href: "/seller/settings" },
];

export default function SellerListings() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<any>(null);
  const [listings, setListings] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [filter, setFilter] = useState("All");
  const [toast, setToast] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    original_price: "",
    condition: "Good",
    category: "Clothing",
    location: "🇮🇳 India",
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }
    setUser(user);

    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("seller_id", user.id)
      .order("created_at", { ascending: false });

    if (data) setListings(data);
    setLoading(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const uploaded: string[] = [];

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "thriftly_uploads");
      formData.append("cloud_name", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!);

      try {
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          { method: "POST", body: formData }
        );
        const data = await res.json();
        if (data.secure_url) uploaded.push(data.secure_url);
      } catch (err) {
        console.error("Upload failed:", err);
      }
    }

    setUploadedImages(prev => [...prev, ...uploaded]);
    setUploading(false);
    showToast(`✅ ${uploaded.length} image(s) uploaded!`);
  };

  const handleAddListing = async () => {
    if (!form.name || !form.price || !form.original_price) {
      showToast("⚠️ Please fill in all required fields!");
      return;
    }

    setSaving(true);

    const { data, error } = await supabase
      .from("products")
      .insert({
        name: form.name,
        description: form.description,
        price: Number(form.price),
        original_price: Number(form.original_price),
        condition: form.condition,
        category: form.category,
        location: form.location,
        images: uploadedImages.length > 0 ? uploadedImages : ["🛍️"],
        seller_id: user.id,
        seller_name: user.user_metadata?.full_name || "Seller",
        seller_email: user.email,
        status: "active",
        views: 0,
      })
      .select()
      .single();

    if (error) {
      showToast("❌ Failed to add listing. Try again.");
      console.error(error);
    } else {
      setListings(prev => [data, ...prev]);
      setForm({ name: "", description: "", price: "", original_price: "", condition: "Good", category: "Clothing", location: "🇮🇳 India" });
      setUploadedImages([]);
      setShowForm(false);
      showToast("🎉 Listing added successfully!");
    }

    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (!error) {
      setListings(prev => prev.filter(l => l.id !== id));
      showToast("🗑️ Listing deleted.");
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    const { error } = await supabase.from("products").update({ status: newStatus }).eq("id", id);
    if (!error) {
      setListings(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
      showToast(`✅ Listing ${newStatus === "active" ? "activated" : "deactivated"}!`);
    }
  };

  const filtered = filter === "All" ? listings : listings.filter(l => l.status === filter.toLowerCase());

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />

      {toast && (
        <div className="fixed top-20 right-6 bg-gray-900 text-white px-4 py-3 rounded-xl text-sm font-semibold z-50 shadow-lg animate-pulse">
          {toast}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8">

        {/* Sidebar */}
        <aside className="w-full lg:w-60 shrink-0">
          <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-4 text-center">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center text-2xl font-black mx-auto mb-3">
              {user?.email?.[0].toUpperCase() || "S"}
            </div>
            <p className="text-sm font-black text-gray-900">{user?.user_metadata?.full_name || "My Store"}</p>
            <p className="text-xs text-gray-400">{user?.email}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {sidebarLinks.map((item) => (
              <Link href={item.href} key={item.label}>
                <div className={`flex items-center gap-3 px-4 py-3.5 cursor-pointer transition border-l-4 ${item.active ? "bg-emerald-50 border-emerald-500" : "border-transparent hover:bg-gray-50"}`}>
                  <span>{item.icon}</span>
                  <span className={`text-sm font-semibold ${item.active ? "text-emerald-700" : "text-gray-700"}`}>{item.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-black text-gray-900">My Listings 📦</h1>
              <p className="text-sm text-gray-400 mt-0.5">{listings.length} total items</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-5 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 transition"
            >
              {showForm ? "✕ Cancel" : "+ List New Item"}
            </button>
          </div>

          {/* Add Listing Form */}
          {showForm && (
            <div className="bg-white rounded-2xl border border-emerald-200 p-6 mb-6 shadow-sm">
              <h2 className="text-base font-black text-gray-900 mb-5">📸 List a New Item</h2>

              {/* Image Upload */}
              <div className="mb-5">
                <label className="text-xs font-bold text-gray-600 mb-2 block">Product Photos</label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50 transition"
                >
                  {uploading ? (
                    <div>
                      <div className="text-2xl mb-2 animate-spin">⏳</div>
                      <p className="text-sm text-emerald-600 font-semibold">Uploading...</p>
                    </div>
                  ) : uploadedImages.length > 0 ? (
                    <div>
                      <div className="flex gap-2 justify-center flex-wrap mb-2">
                        {uploadedImages.map((url, i) => (
                          <img key={i} src={url} alt="" className="w-16 h-16 object-cover rounded-xl border border-gray-200" />
                        ))}
                      </div>
                      <p className="text-xs text-emerald-600 font-semibold">✅ {uploadedImages.length} photo(s) uploaded · Click to add more</p>
                    </div>
                  ) : (
                    <div>
                      <div className="text-3xl mb-2">📸</div>
                      <p className="text-sm font-bold text-gray-700">Click to upload photos</p>
                      <p className="text-xs text-gray-400 mt-1">JPG, PNG up to 10MB each</p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="col-span-2">
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Item Name *</label>
                  <input
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Nike Air Max 90"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 transition"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Description</label>
                  <textarea
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    placeholder="Describe your item — condition, size, brand, reason for selling..."
                    rows={3}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 transition resize-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Your Price (₹) *</label>
                  <input
                    value={form.price}
                    onChange={e => setForm({ ...form, price: e.target.value })}
                    placeholder="e.g. 1200"
                    type="number"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 transition"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Original Price (₹) *</label>
                  <input
                    value={form.original_price}
                    onChange={e => setForm({ ...form, original_price: e.target.value })}
                    placeholder="e.g. 4500"
                    type="number"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 transition"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Category</label>
                  <select
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 bg-white"
                  >
                    {["Clothing", "Ethnic Wear", "Shoes", "Electronics", "Books", "Furniture", "Gaming", "Beauty", "Bags", "Accessories"].map(c => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Condition</label>
                  <select
                    value={form.condition}
                    onChange={e => setForm({ ...form, condition: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 bg-white"
                  >
                    <option>Like New</option>
                    <option>Good</option>
                    <option>Fair</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Your Location</label>
                  <select
                    value={form.location}
                    onChange={e => setForm({ ...form, location: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 bg-white"
                  >
                    {["🇮🇳 Mumbai", "🇮🇳 Delhi", "🇮🇳 Bangalore", "🇮🇳 Chennai", "🇮🇳 Hyderabad", "🇮🇳 Pune", "🇮🇳 Kolkata", "🇮🇳 Jaipur", "🇮🇳 Varanasi", "🇮🇳 India", "🇺🇸 USA", "🇬🇧 UK", "🇦🇺 Australia"].map(l => (
                      <option key={l}>{l}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Preview */}
              {form.name && form.price && (
                <div className="bg-gray-50 rounded-2xl p-4 mb-4 border border-gray-100">
                  <p className="text-xs font-bold text-gray-500 mb-2">Preview:</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded-xl border border-gray-200 flex items-center justify-center overflow-hidden">
                      {uploadedImages[0] ? (
                        <img src={uploadedImages[0]} alt="" className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        <span className="text-2xl">🛍️</span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{form.name}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-black text-emerald-700">₹{Number(form.price).toLocaleString()}</p>
                        {form.original_price && (
                          <p className="text-xs text-gray-400 line-through">₹{Number(form.original_price).toLocaleString()}</p>
                        )}
                        {form.price && form.original_price && (
                          <span className="text-xs bg-red-50 text-red-600 font-bold px-1.5 py-0.5 rounded-md">
                            {Math.round(((Number(form.original_price) - Number(form.price)) / Number(form.original_price)) * 100)}% off
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleAddListing}
                  disabled={saving || uploading}
                  className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? "Saving..." : "🚀 Publish Listing"}
                </button>
                <button
                  onClick={() => { setShowForm(false); setUploadedImages([]); }}
                  className="px-6 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-4">
            {["All", "Active", "Inactive", "Sold"].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition ${filter === f ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-gray-600 border-gray-200 hover:border-emerald-400"}`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Listings */}
          {loading ? (
            <div className="space-y-3">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-200 p-4 animate-pulse flex gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-2xl"></div>
                  <div className="flex-1 space-y-2">
                    <div className="bg-gray-200 h-4 rounded w-1/3"></div>
                    <div className="bg-gray-200 h-3 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
              <div className="text-5xl mb-4">📦</div>
              <p className="text-lg font-black text-gray-700">No listings yet</p>
              <p className="text-sm text-gray-400 mt-1">Click "+ List New Item" to start selling!</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="divide-y divide-gray-100">
                {filtered.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition">
                    {/* Image */}
                    <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center overflow-hidden shrink-0">
                      {item.images?.[0]?.startsWith("http") ? (
                        <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl">{item.images?.[0] || "🛍️"}</span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-400">
                        {item.category} · 👁 {item.views} views · Listed {new Date(item.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>

                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 capitalize ${statusStyle[item.status] || "bg-gray-100 text-gray-600"}`}>
                      {item.status}
                    </span>

                    <p className="text-sm font-black text-emerald-700 shrink-0">₹{item.price.toLocaleString()}</p>

                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => handleToggleStatus(item.id, item.status)}
                        className="text-xs border border-gray-200 text-gray-600 px-2.5 py-1 rounded-lg hover:border-emerald-400 hover:text-emerald-700 transition font-medium"
                      >
                        {item.status === "active" ? "Deactivate" : "Activate"}
                      </button>
                      <Link href={`/product/${item.id}`}>
                        <button className="text-xs border border-gray-200 text-gray-600 px-2.5 py-1 rounded-lg hover:border-blue-400 hover:text-blue-700 transition font-medium">
                          View
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-xs border border-red-100 text-red-400 px-2.5 py-1 rounded-lg hover:bg-red-50 transition font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}