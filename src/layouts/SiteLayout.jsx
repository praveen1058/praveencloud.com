import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollProgress from "../components/ScrollProgress";
import BackToTop from "../components/BackToTop";
import AdSense from "../components/AdSense";
import ScrollManager from "../components/ScrollManager";

export default function SiteLayout({ children }) {
  return (
    <>
      <ScrollManager />
      <ScrollProgress />
      {/* min-h-screen + flex-1 keeps the footer at the bottom of the viewport on short
          pages like /contact, instead of leaving a band of empty space under it. */}
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
      <BackToTop />
      {/* Inert until a publisher ID is set in src/utils/seo.js. */}
      <AdSense />
    </>
  );
}
