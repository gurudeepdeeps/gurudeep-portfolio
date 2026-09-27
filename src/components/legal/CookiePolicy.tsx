import LegalLayout from "./LegalLayout";

export const CookiePolicy = () => {
  return (
    <LegalLayout
      title="Cookie Policy"
      badge="Browser Storage & Tracking"
      lastUpdated="September 2026"
      description="Cookie Policy for Gurudeep V Portfolio detailing essential cookies, local storage tokens, and anonymous analytics usage."
    >
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-white">1. What Are Cookies and Local Storage?</h2>
        <p>
          Cookies and modern browser storage (such as <code className="text-xs bg-black/40 px-1 py-0.5 rounded">localStorage</code>) are small data files saved on your computer or mobile device when you visit web pages. They help maintain your preferences, improve performance, and keep sessions active.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-white">2. Exact Storage Items Used by This Application</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-white/60">
                <th className="py-2.5 pr-4 font-semibold">Key / Cookie Name</th>
                <th className="py-2.5 pr-4 font-semibold">Type</th>
                <th className="py-2.5 pr-4 font-semibold">Purpose</th>
                <th className="py-2.5 font-semibold">Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr>
                <td className="py-3 pr-4 font-mono text-indigo-300">gurudeep_cookie_consent</td>
                <td className="py-3 pr-4">localStorage</td>
                <td className="py-3 pr-4 text-white/70">Remembers whether you accepted all cookies or essential only.</td>
                <td className="py-3 text-white/70">Persistent until cleared</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-mono text-indigo-300">a_session_*</td>
                <td className="py-3 pr-4">Cookie / Storage</td>
                <td className="py-3 pr-4 text-white/70">Maintains secure Appwrite session token when an admin logs in.</td>
                <td className="py-3 text-white/70">Appwrite Session</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-mono text-indigo-300">gurudeep_admin_profile</td>
                <td className="py-3 pr-4">localStorage</td>
                <td className="py-3 pr-4 text-white/70">Caches admin profile display details for the dashboard.</td>
                <td className="py-3 text-white/70">Persistent</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-mono text-indigo-300">Vercel Analytics</td>
                <td className="py-3 pr-4">Anonymous Telemetry</td>
                <td className="py-3 pr-4 text-white/70">Collects privacy-preserving anonymous performance metrics without individual cross-site tracking.</td>
                <td className="py-3 text-white/70">Session / Aggregated</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-white">3. Managing and Disabling Cookies</h2>
        <p>
          You can adjust your consent choices at any time by clicking the <strong>Cookie Preferences</strong> link in the footer of this website, or by configuring your browser settings to reject or delete cookies. Note that disabling essential storage may impact admin dashboard login sessions.
        </p>
      </section>
    </LegalLayout>
  );
};

export default CookiePolicy;
