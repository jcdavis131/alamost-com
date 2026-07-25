"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Tab = { id: string; label: string; href: string; icon: string; shape: string };

const tabs: Tab[] = [
  { id:"shop", label:"Shop", href:"/", icon:"◫", shape:"■" },
  { id:"drops", label:"Drops", href:"/#drops", icon:"◐", shape:"▲" },
  { id:"about", label:"About", href:"/#about", icon:"◎", shape:"●" },
];

export default function BottomTabs(){
  const pathname = usePathname();
  return (
    <nav
      aria-label="Primary"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-black/[0.08] bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80"
      style={{
        height: "calc(56px + env(safe-area-inset-bottom, 0px))",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <div className="mx-auto flex h-[56px] max-w-[1040px] items-stretch justify-around px-2">
        {tabs.map(t=>{
          const active = pathname === t.href || (t.id==="shop" && pathname==="/");
          return (
            <Link
              key={t.id}
              href={t.href}
              aria-current={active ? "page" : undefined}
              className={`flex flex-1 flex-col items-center justify-center gap-[2px] rounded-[10px] text-[11px] font-[650] tracking-[-0.01em] transition-colors ${active ? "text-[#0072B2] bg-[#0072B2]/[0.08]" : "text-[#111110]/70 hover:text-[#111110]"}`}
              style={{lineHeight:"1.1"}}
            >
              {/* triple-encoding: shape + icon + text */}
              <span className="flex items-center gap-1 text-[16px] leading-none" aria-hidden>
                <span className={`inline-flex h-[16px] w-[16px] items-center justify-center rounded-[3px] ${active ? "bg-[#0072B2] text-white" : "bg-black/[0.06] text-black/70"}`}>{t.shape}</span>
                <span>{t.icon}</span>
              </span>
              <span className="text-[11px]">{t.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
