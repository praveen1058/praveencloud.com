import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useState } from "react";
import { useTheme } from "../hooks/useTheme";
import { scrollToSection } from "../utils/scroll";
const links=[["/","Home"],["/#about","About"],["/#experience","Experience"],["/#skills","Skills"],["/projects","Projects"],["/blog","Blog"],["/#contact","Contact"]];
export default function Navbar(){
 const [open,setOpen]=useState(false); const {theme,toggle}=useTheme();
 const navigate=useNavigate(); const {pathname}=useLocation();
 // On home, scroll in place; elsewhere route to "/" with the hash and let Home scroll on mount.
 const go=(e,href)=>{e.preventDefault(); setOpen(false); const id=href.slice(2);
  if(pathname==="/") scrollToSection(id); else navigate({pathname:"/",hash:`#${id}`});};
 return <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-[#070b14]/80">
  <div className="container-page flex h-16 items-center justify-between">
   <Link to="/" className="font-display text-lg font-bold">PK<span className="text-indigo-500">.</span></Link>
   <nav className="hidden items-center gap-6 md:flex">{links.map(([href,label])=>href.startsWith("/#")?<a key={href} href={href} onClick={(e)=>go(e,href)} className="text-sm font-medium text-slate-600 hover:text-indigo-500 dark:text-slate-300">{label}</a>:<NavLink key={href} to={href} className="text-sm font-medium text-slate-600 hover:text-indigo-500 dark:text-slate-300">{label}</NavLink>)}</nav>
   <div className="flex items-center gap-2"><button aria-label="Toggle theme" onClick={toggle} className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-white/10">{theme==="dark"?<Moon size={18}/>:<Sun size={18}/>}</button><button aria-label="Open menu" className="rounded-lg p-2 md:hidden" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button></div>
  </div>
  {open&&<nav className="container-page flex flex-col gap-3 border-t border-slate-200 py-4 md:hidden dark:border-white/10">{links.map(([href,label])=>href.startsWith("/#")?<a key={href} href={href} onClick={(e)=>go(e,href)} className="py-2 text-base font-medium">{label}</a>:<Link key={href} to={href} onClick={()=>setOpen(false)} className="py-2 text-base font-medium">{label}</Link>)}</nav>}
 </header>;
}
