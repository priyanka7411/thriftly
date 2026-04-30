import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link href="/" className="text-xs text-emerald-600 hover:underline">← Back to Home</Link>
          <h1 className="text-3xl font-black text-gray-900 mt-4 mb-2">Privacy Policy</h1>
          <p className="text-sm text-gray-400">Last updated: April 2025</p>
        </div>

        <div className="space-y-6">
          {[
            {
              title: "1. Information We Collect",
              content: "We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support. This includes your name, email address, phone number, shipping address, and payment information."
            },
            {
              title: "2. How We Use Your Information",
              content: "We use the information we collect to process transactions, send order confirmations and updates, provide customer support, send promotional communications (with your consent), improve our services, and comply with legal obligations."
            },
            {
              title: "3. Information Sharing",
              content: "We do not sell your personal information to third parties. We share your information only with sellers to fulfill your orders, payment processors to complete transactions, and service providers who assist us in operating our platform."
            },
            {
              title: "4. Data Security",
              content: "We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. All payments are processed using 256-bit SSL encryption."
            },
            {
              title: "5. Cookies",
              content: "We use cookies and similar tracking technologies to track activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent."
            },
            {
              title: "6. Your Rights",
              content: "You have the right to access, update, or delete your personal information at any time through your account settings. You may also request a copy of all data we hold about you by contacting our support team."
            },
            {
              title: "7. Contact Us",
              content: "If you have any questions about this Privacy Policy, please contact us at privacy@thriftly.com or through our Help Center."
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