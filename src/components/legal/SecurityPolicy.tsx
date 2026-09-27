import LegalLayout from "./LegalLayout";

export const SecurityPolicy = () => {
  return (
    <LegalLayout
      title="Security & Responsible Disclosure"
      badge="Application Security"
      lastUpdated="September 2026"
      description="Security measures and coordinated vulnerability reporting process for Gurudeep V Portfolio."
    >
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-white">1. Security Architecture</h2>
        <p>
          I prioritize the security and integrity of this website and connected backend systems. Key defenses include:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Role-Based Admin Protection:</strong> Portfolio management endpoints require authenticated administrative sessions via Appwrite Cloud authentication.</li>
          <li><strong>HTTPS Encryption:</strong> All transit traffic between clients, Vercel edge networks, and Appwrite Cloud databases is enforced via TLS 1.3 encryption.</li>
          <li><strong>Input Sanitization:</strong> Form fields validate and sanitize payload attributes to protect against injection and cross-site scripting vulnerabilities.</li>
          <li><strong>No Mock Backends:</strong> Real, tested cloud collections and storage buckets isolate admin actions from public operations.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-white">2. Responsible Vulnerability Disclosure</h2>
        <p>
          If you are a security researcher and believe you have discovered a security vulnerability affecting this website or its backend infrastructure, please report it promptly and responsibly:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            Send an email to{" "}
            <a href="mailto:gurudeepv55@gmail.com" className="text-indigo-400 font-semibold underline">
              gurudeepv55@gmail.com
            </a>{" "}
            with the subject line <code className="text-xs bg-black/40 px-1 py-0.5 rounded">[Security Vulnerability Report]</code>.
          </li>
          <li>Include actionable reproduction steps, proof-of-concept details, and potential impact.</li>
          <li>Please allow reasonable time for remediation before publishing details publicly.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-white">3. Scope & Rules of Engagement</h2>
        <p>
          Please avoid any testing that degrades user experience or alters database records:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Do not perform Denial of Service (DoS/DDoS) attacks.</li>
          <li>Do not destroy, delete, or modify other visitors' contact inquiries.</li>
          <li>Do not engage in social engineering, phishing, or physical attacks.</li>
        </ul>
      </section>
    </LegalLayout>
  );
};

export default SecurityPolicy;
