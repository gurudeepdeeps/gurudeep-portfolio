import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  About,
  Contact,
  Feedbacks,
  Hero,
  Navbar,
  Works,
  StarsCanvas,
  Login,
  Dashboard,
  NotFound,
  SEOHead,
  WhatsAppButton,
  ThankYou,
  ErrorBoundary,
  OfflineNotice,
  Unauthorized,
  Support,
  PrivacyPolicy,
  TermsOfService,
  CookiePolicy,
  Disclaimer,
  AccessibilityStatement,
  SecurityPolicy,
} from "./components";
import Footer from "./components/footer";
import { Toaster } from "sonner";

const Home = () => {
  return (
    <div className="relative z-0 bg-primary">
      <SEOHead
        title="Gurudeep V | Full Stack Developer & UI/UX Designer Portfolio"
        description="Official portfolio website of Gurudeep V (Gurudeep Portfolio / Deeps Portfolio). Full Stack Developer specializing in React, Next.js, Appwrite, Python, and modern web application development."
        keywords="Gurudeep V, Gurudeep V Portfolio, Gurudeep Portfolio, Deeps Portfolio, Full Stack Developer, React Developer, Appwrite, Web Developer Portfolio"
        canonicalUrl="https://gurudeep-portfolio.vercel.app/"
      />
      <div className="bg-hero-pattern bg-cover bg-no-repeat bg-center">
        <Navbar />
        <Hero />
      </div>
      <About />
      <Works />
      <Feedbacks />

      <div className="relative z-0">
        <Contact />
        <StarsCanvas />
      </div>
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <OfflineNotice />
        <Toaster position="bottom-right" richColors theme="dark" />
        <WhatsAppButton />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/*" element={<Dashboard />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/support" element={<Support />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/cookies" element={<CookiePolicy />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/accessibility" element={<AccessibilityStatement />} />
          <Route path="/security" element={<SecurityPolicy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
