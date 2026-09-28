import { useEffect, useState } from "react";
export default function ScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setP(max > 0 ? (window.scrollY / max) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return <div aria-hidden="true" className="fixed left-0 right-0 top-0 z-[70] h-1 bg-transparent"><div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400" style={{width:`${p}%`}} /></div>;
}
