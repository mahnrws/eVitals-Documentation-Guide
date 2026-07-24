import type { RoleId } from "./roles";

export interface Step {
  stepNumber: number;
  title: string;
  description: string;
  screenshots?: string[];
}

export interface Subtask {
  id: string;
  title: string;
  purpose?: string;
  steps: Step[];
  screenshots?: string[];
  _manualRef?: string;
}

export interface Article {
  id: string;
  title: string;
  description?: string;
  breadcrumbs?: { label: string; href: string }[];
  module?: string;
  category?: string;
  lastUpdated?: string;
  estimatedReadingTime?: string;
  overview?: string;
  subtasks: Subtask[];
}

export function getArticle(articles: Record<string, Article>, id: string): Article | null {
  return articles[id] ?? null;
}

export function articlesForRole(articles: Record<string, Article>, role: RoleId): Article[] {
  return Object.values(articles).filter((a) => a.id.startsWith(`${role}-`));
}

// -------- Search --------

export interface SearchHit {
  article: Article;
  score: number;
  snippet: string;
  matchedIn: string;
}

function tokenize(s: string): string[] {
  return (s.toLowerCase().match(/[a-z0-9]+/g) ?? []).filter((t) => t.length >= 2);
}

interface IndexedDoc {
  article: Article;
  role: RoleId;
  haystack: string;
  fields: { title: string; module: string; body: string };
}

function buildIndex(articles: Record<string, Article>): IndexedDoc[] {
  return Object.values(articles).map((a) => {
    const parts: string[] = [];
    parts.push(a.title);
    if (a.module) parts.push(a.module);
    if (a.overview) parts.push(a.overview);
    if (a.description) parts.push(a.description);
    const body: string[] = [];
    for (const st of a.subtasks ?? []) {
      body.push(st.title);
      if (st.purpose) body.push(st.purpose);
      for (const s of st.steps ?? []) {
        body.push(s.title);
        body.push(s.description);
      }
    }
    parts.push(body.join(" "));
    const role = (["super-admin", "system-admin", "practice-admin", "practice-caregiver", "system-caregiver", "provider"] as const).find((r) => a.id.startsWith(`${r}-`)) as RoleId;
    return {
      article: a,
      role,
      haystack: parts.join(" \n ").toLowerCase(),
      fields: { title: a.title.toLowerCase(), module: (a.module ?? "").toLowerCase(), body: body.join(" ").toLowerCase() },
    };
  });
}

export function searchInRole(articles: Record<string, Article>, role: RoleId, query: string, limit = 12): SearchHit[] {
  const q = query.trim();
  if (!q) return [];
  const tokens = tokenize(q);
  if (!tokens.length) return [];
  const INDEX = buildIndex(articles);
  const results: SearchHit[] = [];
  for (const doc of INDEX) {
    if (doc.role !== role) continue;
    let score = 0;
    let allMatch = true;
    for (const t of tokens) {
      const inTitle = doc.fields.title.includes(t);
      const inModule = doc.fields.module.includes(t);
      const inBody = doc.fields.body.includes(t);
      if (!inTitle && !inModule && !inBody) {
        allMatch = false;
        break;
      }
      if (inTitle) score += 10;
      if (inModule) score += 5;
      if (inBody) score += 1;
    }
    if (!allMatch) continue;
    let snippet = "";
    let matchedIn = "title";
    const firstTok = tokens[0];
    const idx = doc.fields.body.indexOf(firstTok);
    if (idx >= 0) {
      const start = Math.max(0, idx - 40);
      snippet = doc.fields.body.slice(start, start + 160);
      matchedIn = "content";
    } else {
      snippet = doc.article.description ?? doc.article.overview ?? "";
    }
    results.push({ article: doc.article, score, snippet, matchedIn });
  }
  results.sort((a, b) => b.score - a.score);
  return results.slice(0, limit);
}
