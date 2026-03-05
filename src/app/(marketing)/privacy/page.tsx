import type { Metadata } from "next";
import Header from "@/components/marketing/Header";
import Footer from "@/components/marketing/Footer";

export const metadata: Metadata = { title: "Privacy Policy" };

const LAST_UPDATED = "March 2, 2026";

export default function PrivacyPage() {
  return (
    <div style={{ background: "#080808", minHeight: "100vh" }}>
      <Header />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "60px 24px 120px" }}>

        <div style={{ marginBottom: 48 }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "#f59e0b", letterSpacing: "0.2em", marginBottom: 16 }}>— LEGAL —</div>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--rx-text)", marginBottom: 12 }}>Privacy Policy</h1>
          <p style={{ fontSize: 13, color: "var(--rx-text-3)", fontFamily: "'IBM Plex Mono', monospace" }}>Last updated: {LAST_UPDATED}</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
          {[
            {
              title: "1. Information We Collect",
              content: `We collect information you provide directly, including your email address when you create an account or contact us. We collect freight quote data you submit for processing. We also automatically collect usage data such as pages visited, features used, and technical information about your device and browser.`,
            },
            {
              title: "2. How We Use Your Information",
              content: `We use your information to provide, maintain, and improve RateifyX. This includes processing your freight quotes using AI models, sending you service emails (including magic link authentication), and analyzing usage patterns to improve our product. We do not sell your personal data to third parties.`,
            },
            {
              title: "3. Quote Data and AI Processing",
              content: `Freight quote data you submit is processed by our AI systems to extract structured information. This data is stored securely and associated with your account. We may use anonymized, aggregated data to improve our extraction models. We do not share your specific quote data with other users or third parties.`,
            },
            {
              title: "4. Data Storage and Security",
              content: `Your data is stored using Supabase, a secure cloud database provider. We implement industry-standard security measures including encryption in transit (TLS) and at rest. Access to your data is restricted to authorized personnel only. We retain your data for as long as your account is active and for a reasonable period thereafter.`,
            },
            {
              title: "5. Cookies and Tracking",
              content: `We use cookies and similar technologies for authentication and to remember your preferences. We use analytics cookies to understand how our service is used. You can control cookie settings through your browser, though disabling certain cookies may affect functionality.`,
            },
            {
              title: "6. Third-Party Services",
              content: `We use Supabase for authentication and database services, Anthropic for AI-powered quote extraction, and DodoPayments for payment processing. Each of these services has their own privacy policies. We only share the minimum data necessary for these services to function.`,
            },
            {
              title: "7. Your Rights",
              content: `You have the right to access, correct, or delete your personal data. You may export your data at any time from your account settings. To request deletion of your account and associated data, contact us at privacy@rateifyx.com. We will respond to all requests within 30 days.`,
            },
            {
              title: "8. Changes to This Policy",
              content: `We may update this Privacy Policy from time to time. We will notify you of significant changes by email or by posting a notice in our application. Continued use of RateifyX after changes constitutes acceptance of the updated policy.`,
            },
            {
              title: "9. Contact Us",
              content: `If you have any questions about this Privacy Policy or how we handle your data, please contact us at privacy@rateifyx.com or write to RateifyX Inc., [Address].`,
            },
          ].map((section) => (
            <div key={section.title}>
              <h2 style={{ fontSize: 16, fontWeight: 600, color: "var(--rx-text)", marginBottom: 12 }}>{section.title}</h2>
              <p style={{ fontSize: 14, color: "var(--rx-text-2)", lineHeight: 1.75 }}>{section.content}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
