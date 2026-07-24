"use client";

import Link from "next/link";
import type { RoleId } from "@/lib/roles";
import type { Article } from "@/lib/articles";
import { SearchBar } from "./SearchBar";
import { RolePicker } from "./RolePicker";

export function DocsHeader({ role, articles, hideSearch }: { role: RoleId; articles?: Record<string, Article>; hideSearch?: boolean }) {
  return (
    <header className="sticky top-0 z-30 border-b border-border/30 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3">
        <Link href={`/docs/${role}`} className="flex items-center gap-3 shrink-0">
          <img src="/logo.png" alt="e-Vitals" className="h-8 sm:h-9" />
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          {!hideSearch && articles && (
            <div className="hidden sm:block w-72">
              <SearchBar role={role} articles={articles} />
            </div>
          )}
          <RolePicker role={role} />
        </div>
      </div>
    </header>
  );
}
