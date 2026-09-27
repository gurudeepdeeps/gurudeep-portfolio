import LegalLayout from "./LegalLayout";

export const PrivacyPolicy = () => {
  return (
    <LegalLayout
      title="Privacy Policy"
      badge="Data Protection & Privacy"
      lastUpdated="September 2026"
      description="Privacy Policy for Gurudeep V Portfolio. Learn how contact information and analytics data are collected, handled, and protected."
    >
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-white">1. Overview</h2>
        <p>
          This Privacy Policy outlines how Gurudeep V ("I", "my", or "me") collects, handles, and protects information submitted by visitors to this portfolio website (
          <a href="https://gurudeep-portfolio.vercel.app/" className="text-indigo-400 underline hover:text-indigo-300">
            https://gurudeep-portfolio.vercel.app/
          </a>
          ). I am committed to respecting your privacy and only collecting data required to communicate regarding project opportunities and evaluate website performance.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-white">2. Information Collected</h2>
        <p>I collect personal information only when you voluntarily provide it:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Contact Form Details:</strong> When you submit a project inquiry via the contact form, I collect your full name, email address, optional phone number, and message text.
          </li>
          <li>
            <strong>Direct Communication Data:</strong> If you connect with me directly via WhatsApp, phone, or email, I receive the communication metadata and message content you provide.
          </li>
          <li>
            <strong>Anonymous Performance Metrics:</strong> Aggregated, non-identifying telemetry (such as device type, country, browser, and page view metrics) is measured via Vercel Web Analytics to ensure high uptime and fast loading times.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-white">3. How Information Is Used</h2>
        <p>Collected data is used strictly for the following purposes:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>To review and respond to freelance software inquiries, job proposals, or technical collaboration requests.</li>
          <li>To maintain records of past client enquiries inside our secure database.</li>
          <li>To diagnose technical errors, improve performance across mobile and desktop devices, and maintain site security.</li>
        </ul>
        <p>I do not sell, rent, monetize, or trade your contact information with any marketing agencies or third parties.</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-white">4. Backend Infrastructure & Third-Party Processors</h2>
        <p>This application relies on the following verified cloud providers:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Appwrite Cloud:</strong> Serves as the backend-as-a-service database (<code className="text-xs bg-black/40 px-1 py-0.5 rounded">portfolio_db</code>) and object storage for authenticated admin management and enquiry storage.
          </li>
          <li>
            <strong>Vercel Inc.:</strong> Provides static frontend deployment, CDN edge caching, and privacy-focused Web Analytics.
          </li>
          <li>
            <strong>WhatsApp / Meta:</strong> Provides optional external click-to-chat messaging when initiated by the user.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-white">5. Digital Personal Data Protection (DPDP) Act, 2023 Compliance & Data Principal Rights</h2>
        <p>
          In compliance with the <strong>Digital Personal Data Protection (DPDP) Act, 2023 (India)</strong>, personal data collected via the contact form is processed strictly on the basis of your explicit, affirmative consent for the specified purpose of answering your freelance or professional web development inquiry.
        </p>
        <p>As a Data Principal, you have the following statutory rights:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Right to Access:</strong> You may request a summary of the personal data processed and details of its processing.</li>
          <li><strong>Right to Correction & Erasure:</strong> You may request correction of inaccurate data or complete erasure of your contact submission from our database.</li>
          <li><strong>Right to Withdraw Consent:</strong> You have the right to withdraw your consent at any time as easily as it was given. Upon withdrawal, further processing will cease.</li>
          <li><strong>Right of Grievance Redressal:</strong> You may report grievances or data protection concerns directly to the Data Fiduciary (Gurudeep V) via the contact information below. Grievances are acknowledged within 48 hours.</li>
        </ul>
        <p>
          To exercise any of these rights, please email me directly at{" "}
          <a href="mailto:gurudeepv55@gmail.com" className="text-indigo-400 font-semibold underline">
            gurudeepv55@gmail.com
          </a>{" "}
          with the subject line <code className="text-xs bg-black/40 px-1 py-0.5 rounded">[DPDP Data Request]</code>.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-white">6. Contact Information</h2>
        <p>If you have any questions or concerns regarding this policy, you can contact:</p>
        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1 text-sm">
          <p><strong>Gurudeep V</strong></p>
          <p>Email: <a href="mailto:gurudeepv55@gmail.com" className="text-indigo-400">gurudeepv55@gmail.com</a></p>
          <p>Phone / WhatsApp: <a href="tel:+917353577717" className="text-indigo-400">+91 7353577717</a></p>
          <p>Location: Bengaluru, Karnataka, India</p>
        </div>
      </section>
    </LegalLayout>
  );
};

export default PrivacyPolicy;
