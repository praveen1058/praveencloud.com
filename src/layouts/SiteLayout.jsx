import Navbar from "../components/Navbar"; import Footer from "../components/Footer"; import ScrollProgress from "../components/ScrollProgress"; import BackToTop from "../components/BackToTop";
export default function SiteLayout({children}){return <><ScrollProgress/><Navbar/><main id="main">{children}</main><BackToTop/><Footer/></>}
