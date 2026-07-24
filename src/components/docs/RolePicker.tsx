"use client";

import Link from "next/link";
import { ROLES, type RoleId } from "@/lib/roles";
import { ChevronDown, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function RolePicker({ role }: { role: RoleId }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function h(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const current = ROLES.find((r) => r.id === role)!;
  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-xl border border-border/60 bg-white px-3.5 py-2 text-sm font-medium shadow-[0_1px_4px_-1px_rgba(0,0,0,0.03)] transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:border-[#b8d4f0] hover:shadow-[0_4px_20px_-4px_rgba(80,150,220,0.12)] hover:-translate-y-0.5 focus:outline-none"
      >
        <span>{current.label}</span>
        <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-[#d8e6f5] bg-white shadow-[0_16px_48px_-12px_rgba(80,150,220,0.18),0_0px_16px_-4px_rgba(80,150,220,0.08)] py-1">
          {ROLES.map((r) => (
            <Link
              key={r.id}
              href={`/docs/${r.id}`}
              onClick={() => setOpen(false)}
              className={`flex items-center justify-between px-3.5 py-2.5 text-sm transition-all duration-200 ${
                r.id === role
                  ? "bg-[#f0f5ff] font-medium text-foreground"
                  : "text-muted-foreground hover:bg-[#f0f5ff]/50 hover:text-foreground"
              }`}
            >
              <span>{r.label}</span>
              {r.id === role && <Check className="h-3.5 w-3.5 text-brand" />}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
