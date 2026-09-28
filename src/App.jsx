import { lazy } from "react";
import { Routes, Route } from "react-router-dom";

import SiteLayout from "./layouts/SiteLayout";

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Projects = lazy(() => import("./pages/Projects"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogCategory = lazy(() => import("./pages/BlogCategory"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const Terms = lazy(() => import("./pages/Terms"));
const Disclaimer = lazy(() => import("./pages/Disclaimer"));
const NotFound = lazy(() => import("./pages/NotFound"));

export default function App() {
  return (
    <SiteLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:slug" element={<ProjectDetail />} />

        <Route path="/blog" element={<Blog />} />
        {/* Category and article routes take any slug, so a new folder or .md file in
            blog/ is reachable without touching this file. */}
        <Route path="/blog/:category" element={<BlogCategory />} />
        <Route path="/blog/:category/:slug" element={<BlogPost />} />

        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<Terms />} />
        <Route path="/disclaimer" element={<Disclaimer />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </SiteLayout>
  );
}
