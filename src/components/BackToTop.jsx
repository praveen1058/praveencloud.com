import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
export default function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const f=()=>setShow(window.scrollY>500); window.addEventListener("scroll",f,{passive:true}); return()=>window.removeEventListener("scroll",f);
  },[]);
  if (!show) return null;
  return <button aria-label="Back to top" onClick={()=>window.scrollTo({top:0,behavior:"smooth"})} className="fixed bottom-6 right-6 z-50 rounded-full border border-slate-200 bg-white p-3 shadow-lg transition hover:-translate-y-1 dark:border-white/10 dark:bg-slate-900"><ArrowUp size={18}/></button>;
}
