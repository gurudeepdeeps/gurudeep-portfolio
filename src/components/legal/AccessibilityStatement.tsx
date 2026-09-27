import LegalLayout from "./LegalLayout";

export const AccessibilityStatement = () => {
  return (
    <LegalLayout
      title="Accessibility Statement"
      badge="Digital Inclusion"
      lastUpdated="September 2026"
      description="Accessibility commitment and features implemented on Gurudeep V Portfolio."
    >
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-white">1. Commitment to Accessibility</h2>
        <p>
          I believe the web should be accessible to everyone, including people with diverse motor, cognitive, visual, and auditory abilities. I strive to continuously improve the usability and digital accessibility of this website.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-white">2. Measures Taken</h2>
        <p>This website incorporates the following design and technical practices:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Semantic HTML:</strong> Standard semantic landmark elements (header, main, nav, footer, sections) are used to aid screen-reader navigation.</li>
          <li><strong>Keyboard Focus:</strong> Form fields, navigation anchors, and interactive buttons feature visible focus indicators and accessible touch targets.</li>
          <li><strong>High Contrast Typography:</strong> Dark mode typography adheres to clear legibility standards across modern monitors and mobile screens.</li>
          <li><strong>Interactive Canvas Fallbacks:</strong> Interactive Three.js 3D canvases are augmented with accessible HTML headings and text-based project summaries so content is readable even if WebGL is disabled.</li>
          <li><strong>Reduced Motion Awareness:</strong> Animation loops and transitions are designed to minimize disorientation, and respect operating system motion preferences where supported.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-white">3. Known Limitations</h2>
        <p>
          While every effort is made to maintain optimal accessibility, certain complex WebGL canvas models (such as 3D canvas rotations) are visual experiences that may have limited screen reader interaction beyond the provided semantic HTML captions and project text descriptions.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-white">4. Feedback & Assistance</h2>
        <p>
          If you encounter an accessibility barrier or need assistance accessing any content on this portfolio, please reach out directly:
        </p>
        <p>
          Email:{" "}
          <a href="mailto:gurudeepv55@gmail.com" className="text-indigo-400 font-semibold underline">
            gurudeepv55@gmail.com
          </a>
        </p>
      </section>
    </LegalLayout>
  );
};

export default AccessibilityStatement;
