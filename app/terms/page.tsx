import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link href="/" className="text-xs text-emerald-600 hover:underline">← Back to Home</Link>
          <h1 className="text-3xl font-black text-gray-900 mt-4 mb-2">Terms of Service</h1>
          <p className="text-sm text-gray-400">Last updated: April 2025</p>
        </div>

        <div className="space-y-6">
          {[
            {
              title: "1. Acceptance of Terms",
              content: "By accessing and using Thriftly, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use our platform."
            },
            {
              title: "2. User Accounts",
              content: "You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account. You must be at least 18 years old to use our services."
            },
            {
              title: "3. Buying & Selling",
              content: "Sellers are responsible for the accuracy of their listings. All items must be genuine, legally owned, and accurately described. Thriftly charges a 10% commission on each successful sale. Buyers are protected under our Buyer Protection Policy."
            },
            {
              title: "4. Prohibited Items",
              content: "The following items are strictly prohibited on Thriftly: counterfeit goods, stolen items, hazardous materials, illegal items, and items that infringe on intellectual property rights. Violation will result in immediate account suspension."
            },
            {
              title: "5. Payments & Refunds",
              content: "All payments are processed securely through Stripe. Buyers may request a refund within 7 days of delivery if the item is significantly different from the listing description. Refunds are processed within 5-7 business days."
            },
            {
              title: "6. Dispute Resolution",
              content: "In case of disputes between buyers and sellers, Thriftly will act as a neutral mediator. Our support team will review all evidence and make a final decision within 48 hours. Both parties agree to abide by our decision."
            },
            {
              title: "7. Limitation of Liability",
              content: "Thriftly is not liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the platform. Our total liability shall not exceed the amount paid for the transaction in question."
            },
            {
              title: "8. Changes to Terms",
              content: "Thriftly reserves the right to modify these terms at any time. We will notify users of significant changes via email. Continued use of the platform after changes constitutes acceptance of the new terms."
            },
          ].map((section) => (
            <div key={section.title} className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-base font-black text-gray-900 mb-3">{section.title}</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>
      </div>

      <footer className="bg-white border-t border-gray-200 py-6 px-6 text-center mt-8">
        <p className="text-xs text-gray-400">© 2025 Thriftly. Made with ❤️ in India 🇮🇳 for the World 🌍</p>
      </footer>
    </div>
  );
}