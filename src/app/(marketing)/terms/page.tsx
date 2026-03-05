import type { Metadata } from "next";
import Header from "@/components/marketing/Header";
import Footer from "@/components/marketing/Footer";

export const metadata: Metadata = { title: "Terms of Service" };

const LAST_UPDATED = "March 2, 2026";

export default function TermsPage() {
  return (
    <div style={{ background: "#080808", minHeight: "100vh" }}>
      <Header />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "60px 24px 120px" }}>

        <div style={{ marginBottom: 48 }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "#f59e0b", letterSpacing: "0.2em", marginBottom: 16 }}>— LEGAL —</div>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--rx-text)", marginBottom: 12 }}>Terms of Service</h1>
          <p style={{ fontSize: 13, color: "var(--rx-text-3)", fontFamily: "'IBM Plex Mono', monospace" }}>Last updated: {LAST_UPDATED}</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
          {[
            {
              title: "1. Acceptance of Terms",
              content: `By accessing or using RateifyX ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use the Service. These terms apply to all users, including free trial users and paid subscribers.`,
            },
            {
              title: "2. Description of Service",
              content: `RateifyX is a freight quote normalization platform that uses artificial intelligence to extract and compare shipping rates from various carrier formats. The Service includes a web application, email processing inbox, file upload capabilities, and API access (on eligible plans).`,
            },
            {
              title: "3. Account Registration",
              content: `You must provide a valid email address to use the Service. You are responsible for maintaining the security of your account. You must notify us immediately of any unauthorized access. You may not share your account credentials with others or create multiple accounts for the purpose of circumventing plan limits.`,
            },
            {
              title: "4. Subscription Plans and Billing",
              content: `RateifyX offers monthly and annual subscription plans. Billing occurs at the start of each billing period. Annual plans are billed upfront at 20% off the equivalent monthly rate. Payments are processed by DodoPayments. Prices are in USD and exclusive of applicable taxes. We reserve the right to change pricing with 30 days notice.`,
            },
            {
              title: "5. Free Trial",
              content: `New accounts receive a 14-day free trial with full access to the selected plan's features. No credit card is required to start a trial. At the end of the trial, you must subscribe to continue using the Service. Trial usage counts toward your plan limits.`,
            },
            {
              title: "6. Acceptable Use",
              content: `You may not use the Service for any illegal purpose or in violation of any applicable laws. You may not attempt to reverse-engineer, scrape, or extract data from the Service beyond your authorized access. You may not use the Service to process data belonging to third parties without their consent. Abuse of the magic email inbox or API may result in account suspension.`,
            },
            {
              title: "7. Data and Content",
              content: `You retain ownership of all freight quote data and content you submit. By submitting data, you grant RateifyX a limited license to process it for the purpose of providing the Service. We may use anonymized, aggregated data to improve our AI models. We do not claim ownership of your data.`,
            },
            {
              title: "8. Service Availability",
              content: `We strive to maintain 99.9% uptime but do not guarantee uninterrupted service. Scheduled maintenance will be communicated in advance when possible. We are not liable for losses resulting from service downtime or outages.`,
            },
            {
              title: "9. Limitation of Liability",
              content: `RateifyX is provided "as is." We make no warranties about the accuracy of AI-extracted data. Always verify extracted quote data before sending to customers. Our total liability to you shall not exceed the amount you paid in the 12 months preceding the claim. We are not liable for indirect, incidental, or consequential damages.`,
            },
            {
              title: "10. Termination",
              content: `You may cancel your subscription at any time from your account settings. Cancellation takes effect at the end of your current billing period. We reserve the right to suspend or terminate accounts that violate these terms. Upon termination, you may export your data within 30 days before it is deleted.`,
            },
            {
              title: "11. Governing Law",
              content: `These Terms are governed by the laws of the State of Delaware, USA, without regard to conflict of law principles. Any disputes shall be resolved through binding arbitration in accordance with AAA rules.`,
            },
            {
              title: "12. Contact",
              content: `For questions about these Terms, contact us at legal@rateifyx.com.`,
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
