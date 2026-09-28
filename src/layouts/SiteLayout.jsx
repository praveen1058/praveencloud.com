import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollProgress from "../components/ScrollProgress";
import BackToTop from "../components/BackToTop";
import AdSense from "../components/AdSense";

export default function SiteLayout({ children }) {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main id="main">{children}</main>
      <BackToTop />
      <Footer />
      {/* Inert until a publisher ID is set in src/utils/seo.js. */}
      <AdSense />
    </>
  );
}
