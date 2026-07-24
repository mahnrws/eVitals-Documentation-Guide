"use client";

import Link from "next/link";
import { useState, useRef, useCallback } from "react";
import type { RoleId, RoleModule } from "@/lib/roles";
import type { Article } from "@/lib/articles";
import { searchInRole } from "@/lib/articles";
import { getRoleModules } from "@/lib/roles";
import {
  BookOpen,
  Users,
  Heart,
  Settings,
  MessageSquare,
  LayoutDashboard,
  Search,
  FileText,
  ArrowRight,
} from "lucide-react";

const GROUP_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "Getting Started": BookOpen,
  "User Management": Users,
  "Patient Care": Heart,
  "Practice Operations": LayoutDashboard,
  "Configuration": Settings,
  "Communication": MessageSquare,
};

interface Props {
  role: RoleId;
  grouped: Record<string, RoleModule[]>;
  groups: readonly string[];
  articles: Record<string, Article>;
}

export function ModuleCardGrid({ role, grouped, groups, articles }: Props) {
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const results = query.trim() ? searchInRole(articles, role, query, 6) : [];

  const roleModules = getRoleModules(role);
  const quickTags = roleModules.slice(0, 5).map((mod) => mod.docTitle);

  // Card hover with delay to allow cursor to move to dropdown
  const handleCardEnter = useCallback((group: string) => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setExpandedGroup(group);
  }, []);

  const handleCardLeave = useCallback(() => {
    closeTimerRef.current = setTimeout(() => setExpandedGroup(null), 150);
  }, []);

  const handleDropdownEnter = useCallback(() => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
  }, []);

  const handleDropdownLeave = useCallback(() => {
    closeTimerRef.current = setTimeout(() => setExpandedGroup(null), 100);
  }, []);

  return (
    <div>
      {/* Centered Search */}
      <div className="mb-10 mx-auto max-w-xl">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted-foreground/40" />
          <input
            type="text"
            value={query}
            placeholder="Search documentation"
            onChange={(e) => { setQuery(e.target.value); setSearchOpen(true); }}
            onFocus={() => setSearchOpen(true)}
            onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
            className="w-full rounded-2xl border border-[#d8e6f5] bg-white pl-11 pr-4 py-4 text-[15px] shadow-[0_2px_8px_-2px_rgba(80,150,220,0.08)] outline-none transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] focus:border-[#a8c8e8] focus:shadow-[0_8px_40px_-8px_rgba(80,150,220,0.2),0_0px_20px_-4px_rgba(80,150,220,0.1)] focus:-translate-y-0.5 placeholder:text-muted-foreground/50"
          />
        </div>

        {/* Quick Tags */}
        <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2">
          {quickTags.map((tag) => (
            <button
              key={tag}
              onMouseDown={(e) => {
                e.preventDefault();
                setQuery(tag);
                setSearchOpen(true);
              }}
              className="rounded-full border border-[#d8e6f5] bg-white px-4 py-1.5 text-[13px] text-muted-foreground transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:border-[#a8c8e8] hover:text-foreground hover:shadow-[0_4px_20px_-4px_rgba(80,150,220,0.18)] hover:-translate-y-0.5"
            >
              {tag}
            </button>
          ))}
        </div>

        {searchOpen && query.trim() && results.length > 0 && (
          <div
            className="mt-2 rounded-xl border border-[#d8e6f5] bg-white py-1 shadow-[0_16px_48px_-12px_rgba(80,150,220,0.2),0_0px_20px_-4px_rgba(80,150,220,0.1)]"
            onMouseDown={(e) => e.preventDefault()}
          >
            {results.map((hit) => {
              const slug = hit.article.id.replace(`${role}-`, "");
              return (
                <Link
                  key={hit.article.id}
                  href={`/docs/${role}/${slug}`}
                  onMouseDown={(e) => e.preventDefault()}
                  className="flex items-center justify-between px-4 py-3 hover:bg-[#f0f5ff]/60 transition-all duration-200"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-foreground truncate">{hit.article.title}</div>
                    {hit.snippet && (
                      <p className="text-xs text-muted-foreground truncate mt-0.5">{hit.snippet}</p>
                    )}
                  </div>
                  <ArrowRight className="ml-3 h-3.5 w-3.5 shrink-0 text-muted-foreground/30" />
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Module Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => {
          const mods = grouped[group];
          if (!mods?.length) return null;

          const Icon = GROUP_ICONS[group] || FileText;
          const isExpanded = expandedGroup === group;
          const guideCount = mods.length;

          return (
            <div
              key={group}
              className="group relative"
              onMouseEnter={() => handleCardEnter(group)}
              onMouseLeave={handleCardLeave}
            >
              <div
                className={`
                  relative rounded-2xl border bg-white p-6 cursor-pointer overflow-hidden
                  transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]
                  ${isExpanded
                    ? "border-[#b8d4f0] shadow-[0_8px_40px_-8px_rgba(80,150,220,0.22),0_0px_20px_-4px_rgba(80,150,220,0.1)] -translate-y-1"
                    : "border-[#d8e6f5] shadow-[0_1px_4px_-1px_rgba(80,150,220,0.06)] hover:shadow-[0_8px_40px_-8px_rgba(80,150,220,0.22),0_0px_20px_-4px_rgba(80,150,220,0.1)] hover:border-[#b8d4f0] hover:-translate-y-1"
                  }
                `}
              >
                <div className="mb-4 transition-transform duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:translate-x-0.5">
                  <Icon className="h-6 w-6 text-foreground/80" />
                </div>
                <h3 className="text-[15px] font-semibold text-foreground">{group} Module</h3>
                <p className="mt-1 text-sm text-muted-foreground/60">
                  {guideCount} {guideCount === 1 ? "guide" : "guides"}
                </p>
              </div>

              {isExpanded && mods.length > 0 && (
                <div
                  className="absolute left-0 right-0 top-full z-10 mt-2 rounded-xl border border-[#d8e6f5] bg-white p-2 shadow-[0_16px_48px_-12px_rgba(80,150,220,0.18),0_0px_16px_-4px_rgba(80,150,220,0.08)] animate-in fade-in slide-in-from-top-1 duration-200"
                  onMouseEnter={handleDropdownEnter}
                  onMouseLeave={handleDropdownLeave}
                >
                  <ul className="space-y-0.5">
                    {mods.map((mod) => {
                      const slug = mod.articleId.replace(`${role}-`, "");
                      return (
                        <li key={mod.articleId}>
                          <Link
                            href={`/docs/${role}/${slug}`}
                            className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-[#f0f5ff]/60 hover:text-foreground transition-all duration-200"
                          >
                            <span>{mod.docTitle}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
