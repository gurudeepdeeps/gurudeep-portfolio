import LegalLayout from "./LegalLayout";

export const TermsOfService = () => {
  return (
    <LegalLayout
      title="Terms of Service"
      badge="Terms of Use"
      lastUpdated="September 2026"
      description="Terms of Service for Gurudeep V Portfolio. Understand the terms governing site usage, intellectual property, and contact inquiries."
    >
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-white">1. Acceptance of Terms</h2>
        <p>
          By accessing and browsing this portfolio website, you agree to comply with and be bound by these Terms of Service. If you disagree with any part of these terms, please discontinue using the website.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-white">2. Intellectual Property & Portfolio Showcases</h2>
        <p>
          All original text, website code structure, graphics, and custom design layouts produced on this site are the intellectual property of Gurudeep V unless otherwise stated.
        </p>
        <p>
          Third-party logos, client company names (such as <em>The Wed 24</em>, <em>Nexgen SJBIT</em>, <em>M S Properties</em>, and <em>Xpensive Media</em>), and referenced trademarks belong to their respective owners. These are displayed solely for the purpose of demonstrating professional design and development work completed.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-white">3. Acceptable Use of Forms & Site Assets</h2>
        <p>You agree not to:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Transmit spam, unsolicited commercial advertisements, phishing links, or abusive messages through the contact form.</li>
          <li>Attempt unauthorized access to the admin management dashboard, Appwrite database endpoints, or storage buckets.</li>
          <li>Use automated scripts, scrapers, or denial-of-service techniques against the website or underlying infrastructure.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-white">4. External Links</h2>
        <p>
          This website contains hyperlinks to external sites, including client deployments (such as <code className="text-xs bg-black/40 px-1 py-0.5 rounded">thewed24.com</code>, <code className="text-xs bg-black/40 px-1 py-0.5 rounded">xpensivemedia.vercel.app</code>), GitHub profiles, and social networks. I do not govern or bear responsibility for the content, privacy practices, or uptime of third-party domains.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-white">5. Limitation of Liability & Warranty Disclaimer</h2>
        <p>
          This website is provided on an "as is" and "as available" basis without warranties of any kind. I shall not be liable for any indirect, incidental, or consequential damages resulting from your access to or inability to access this website.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-white">6. Inquiries & Project Engagements</h2>
        <p>
          Submitting a message via the contact form or engaging via WhatsApp does not automatically constitute a binding freelance development contract. Formal client engagements, deliverables, milestones, and payment terms are agreed upon through written project proposals.
        </p>
      </section>
    </LegalLayout>
  );
};

export default TermsOfService;
