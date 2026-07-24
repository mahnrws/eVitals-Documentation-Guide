"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Search, X, ArrowRight } from "lucide-react";
import { searchInRole, type Article, type SearchHit } from "@/lib/articles";
import type { RoleId } from "@/lib/roles";
import { getRoleLabel } from "@/lib/roles";

interface Props {
  role: RoleId;
  articles: Record<string, Article>;
}

export function SearchBar({ role, articles }: Props) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const results: SearchHit[] = useMemo(
    () => (q.trim() ? searchInRole(articles, role, q, 10) : []),
    [q, role, articles],
  );

  useEffect(() => {
    setActive(0);
  }, [q, role]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  function highlight(text: string, query: string) {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
    return parts.map((p, i) =>
      p.toLowerCase() === query.toLowerCase() ? (
        <mark key={i} className="bg-brand/10 text-foreground rounded-sm px-0.5">
          {p}
        </mark>
      ) : (
        <span key={i}>{p}</span>
      ),
    );
  }

  return (
    <div ref={wrapRef} className="relative w-full">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          value={q}
          placeholder={`Search ${getRoleLabel(role)} docs...`}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActive((a) => Math.min(a + 1, results.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((a) => Math.max(a - 1, 0));
            } else if (e.key === "Enter" && results[active]) {
              const hit = results[active];
              const slug = hit.article.id.replace(`${role}-`, "");
              window.location.href = `/docs/${role}/${slug}`;
            }
          }}
          className="w-full rounded-xl border border-border/60 bg-white pl-10 pr-20 py-2.5 text-sm shadow-[0_1px_4px_-1px_rgba(0,0,0,0.03)] outline-none transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] focus:border-[#b8d4f0] focus:shadow-[0_4px_24px_-4px_rgba(80,150,220,0.15),0_0px_12px_-2px_rgba(80,150,220,0.08)]"
        />
        {q && (
          <button
            aria-label="Clear"
            onClick={() => setQ("")}
            className="absolute right-12 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:bg-muted transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
        <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground sm:inline-block">
          /
        </kbd>
      </div>

      {open && q.trim() && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[70vh] overflow-y-auto rounded-xl border border-[#d8e6f5] bg-white shadow-[0_16px_48px_-12px_rgba(80,150,220,0.18),0_0px_16px_-4px_rgba(80,150,220,0.08)]">
          {results.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-sm text-muted-foreground">
                No results for &quot;{q}&quot; in {getRoleLabel(role)}
              </p>
            </div>
          ) : (
            <ul className="py-1">
              {results.map((hit, i) => {
                const slug = hit.article.id.replace(`${role}-`, "");
                return (
                  <li key={hit.article.id}>
                    <Link
                      href={`/docs/${role}/${slug}`}
                      onClick={() => setOpen(false)}
                      className={`flex items-center justify-between px-4 py-3 transition-colors ${
                        i === active ? "bg-muted" : "hover:bg-muted/50"
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-sm text-foreground truncate">
                          {highlight(hit.article.title, q)}
                        </div>
                        {hit.snippet && (
                          <p className="mt-0.5 text-xs text-muted-foreground truncate">
                            {highlight(hit.snippet, q)}
                          </p>
                        )}
                      </div>
                      <ArrowRight className="ml-3 h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
