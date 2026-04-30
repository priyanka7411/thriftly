"use client";
import Link from "next/link";
import { useState } from "react";

const users = [
  { id: 1, name: "Priyanka Malavade", email: "priyasmalavade@gmail.com", role: "Buyer", joined: "Apr 26, 2025", orders: 4, spent: "₹11,749", status: "Active", avatar: "P" },
  { id: 2, name: "Rahul Sharma", email: "rahul@gmail.com", role: "Buyer", joined: "Apr 10, 2025", orders: 2, spent: "₹4,399", status: "Active", avatar: "R" },
  { id: 3, name: "Ethnic Finds Store", email: "ethnic@gmail.com", role: "Seller", joined: "Jan 2023", orders: 134, spent: "₹58,200", status: "Active", avatar: "E" },
  { id: 4, name: "Meera Kapoor", email: "meera@gmail.com", role: "Buyer", joined: "Mar 28, 2025", orders: 1, spent: "₹2,500", status: "Active", avatar: "M" },
  { id: 5, name: "Suspicious User", email: "sus@gmail.com", role: "Buyer", joined: "Apr 1, 2025", orders: 0, spent: "₹0", status: "Flagged", avatar: "S" },
];

const adminLinks = [
  { icon: "📊", label: "Overview", href: "/admin" },
  { icon: "👥", label: "Users", href: "/admin/users", active: true },
  { icon: "🏪", label: "Sellers", href: "/admin/sellers", badge: "3" },
  { icon: "📦", label: "Listings", href: "/admin/listings" },
  { icon: "🛒", label: "Orders", href: "/admin/orders" },
  { icon: "💰", label: "Revenue", href: "/admin/revenue" },
  { icon: "🚨", label: "Reports", href: "/admin/reports", badge: "2" },
  { icon: "⚙️", label: "Settings", href: "/admin/settings" },
];

export default function AdminUsers() {
  const [search, setSearch] = useState("");
  const [users_list, setUsers] = useState(users);

  const filtered = users_list.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const banUser = (id: number) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: "Banned" } : u));
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-gray-900 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white text-sm font-black">T</div>
              <span className="text-xl font-black text-white">Thriftly</span>
            </Link>
            <span className="text-xs bg-red-500 text-white px-2.5 py-1 rounded-full font-bold">Admin</span>
          </div>
          <Link href="/" className="text-xs text-gray-400 hover:text-white">← Back to Site</Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
        <aside className="w-56 shrink-0">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {adminLinks.map((item) => (
              <Link href={item.href} key={item.label}>
                <div className={`flex items-center gap-3 px-4 py-3.5 cursor-pointer transition border-l-4 ${item.active ? "bg-emerald-50 border-emerald-500" : "border-transparent hover:bg-gray-50"}`}>
                  <span>{item.icon}</span>
                  <span className={`text-sm font-semibold flex-1 ${item.active ? "text-emerald-700" : "text-gray-700"}`}>{item.label}</span>
                  {item.badge && <span className="bg-red-500 text-white text-xs font-black px-1.5 py-0.5 rounded-full">{item.badge}</span>}
                </div>
              </Link>
            ))}
          </div>
        </aside>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-black text-gray-900">Users 👥</h1>
              <p className="text-sm text-gray-400 mt-0.5">{users_list.length} total users</p>
            </div>
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-emerald-500 transition w-56"
            />
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {["User", "Role", "Joined", "Orders", "Total Spent", "Status", "Action"].map(h => (
                    <th key={h} className="text-xs font-bold text-gray-500 text-left px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xs font-black">{user.avatar}</div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${user.role === "Seller" ? "bg-purple-50 text-purple-700 border border-purple-200" : "bg-blue-50 text-blue-700 border border-blue-200"}`}>{user.role}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">{user.joined}</td>
                    <td className="px-4 py-3 text-xs font-semibold text-gray-700">{user.orders}</td>
                    <td className="px-4 py-3 text-xs font-black text-emerald-700">{user.spent}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        user.status === "Active" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                        user.status === "Flagged" ? "bg-orange-50 text-orange-700 border border-orange-200" :
                        "bg-red-50 text-red-600 border border-red-200"
                      }`}>{user.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button className="text-xs border border-gray-200 text-gray-600 px-2 py-1 rounded-lg hover:border-emerald-400 transition">View</button>
                        {user.status !== "Banned" && (
                          <button onClick={() => banUser(user.id)} className="text-xs border border-red-100 text-red-500 px-2 py-1 rounded-lg hover:bg-red-50 transition">Ban</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}