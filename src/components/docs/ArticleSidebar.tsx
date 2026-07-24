"use client";

import Link from "next/link";
import { getRoleModulesGrouped, ROLE_GROUPS, type RoleId } from "@/lib/roles";
import type { Article } from "@/lib/articles";
import { ChevronRight } from "lucide-react";

interface Props {
  role: RoleId;
  article?: Article;
  activeSubtaskId?: string;
}

export function ArticleSidebar({ role, article, activeSubtaskId }: Props) {
  const grouped = getRoleModulesGrouped(role);
  const activeArticleId = article?.id;

  return (
    <nav className="h-full overflow-y-auto py-6 pr-4 text-sm">
      {ROLE_GROUPS.map((group) => {
        const mods = grouped[group];
        if (!mods?.length) return null;
        return (
          <div key={group} className="mb-6">
            <div className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
              {group}
            </div>
            <ul className="space-y-0.5">
              {mods.map((mod) => {
                const active = mod.articleId === activeArticleId;
                const slug = mod.articleId.replace(`${role}-`, "");
                return (
                  <li key={mod.articleId}>
                    <Link
                      href={`/docs/${role}/${slug}`}
                      className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
                        active
                          ? "bg-[#f0f5ff] font-medium text-brand border-l-2 border-brand ml-0 pl-[10px]"
                          : "text-muted-foreground hover:bg-[#f0f5ff]/50 hover:text-foreground hover:translate-x-0.5"
                      }`}
                    >
                      <ChevronRight
                        className={`h-3 w-3 transition-transform duration-200 ${
                          active ? "rotate-90 text-brand" : ""
                        }`}
                      />
                      <span className="text-[13px]">{mod.docTitle}</span>
                    </Link>
                    {active && article && article.subtasks.length > 0 && (
                      <ul className="ml-5 mt-1 space-y-0.5 border-l border-border pl-3">
                        {article.subtasks.map((st) => (
                          <li key={st.id}>
                            <a
                              href={`#${st.id}`}
                              className={`block rounded-md px-2.5 py-1.5 text-xs transition-colors ${
                                activeSubtaskId === st.id
                                  ? "bg-muted font-medium text-foreground"
                                  : "text-muted-foreground hover:text-foreground"
                              }`}
                            >
                              {st.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}
