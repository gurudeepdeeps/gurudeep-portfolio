import LegalLayout from "./LegalLayout";

export const Disclaimer = () => {
  return (
    <LegalLayout
      title="Website & Work Disclaimer"
      badge="Legal Notices"
      lastUpdated="September 2026"
      description="Legal disclaimer regarding work samples, client trademarks, external links, and open-source 3D models."
    >
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-white">1. Professional Portfolio Showcase</h2>
        <p>
          The content displayed on this website represents the professional design, web development, and digital media portfolio of Gurudeep V. Past project outcomes and client case studies reflect specific project scopes and do not guarantee identical results for future engagements.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-white">2. Trademarks & Brand Attributions</h2>
        <p>
          All product names, logos, brands, and registered trademarks displayed in project case studies, client testimonials, and work experience sections (such as <em>The Wed 24</em>, <em>Nexgen SJBIT</em>, <em>Pixel Planet</em>, <em>M S Properties</em>, and <em>Xpensive Media</em>) are property of their respective trademark holders. Their inclusion on this website is for portfolio reference only and does not imply endorsement.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-white">3. Third-Party 3D Assets & Open Source</h2>
        <p>
          The interactive 3D elements on this site utilize WebGL and Three.js technologies. Specific 3D computer and planet models are used in accordance with their respective Creative Commons and open-source licenses, with attribution licenses documented within <code className="text-xs bg-black/40 px-1 py-0.5 rounded">public/desktop_pc/license.txt</code> and <code className="text-xs bg-black/40 px-1 py-0.5 rounded">public/planet/license.txt</code>.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-white">4. "As-Is" Information Notice</h2>
        <p>
          The technical tutorials, stack recommendations, and descriptions provided across this site are provided in good faith for informational purposes only without warranty of completeness or operational accuracy for your specific environment.
        </p>
      </section>
    </LegalLayout>
  );
};

export default Disclaimer;
