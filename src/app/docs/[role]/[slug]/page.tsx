import { notFound } from "next/navigation";
import Link from "next/link";
import { isValidRole, getRoleLabel, type RoleId } from "@/lib/roles";
import { loadAllArticles } from "@/lib/articles-loader";
import { getArticle } from "@/lib/articles";
import { DocsHeader } from "@/components/docs/DocsHeader";
import { ArticleSidebar } from "@/components/docs/ArticleSidebar";
import { ArticleView } from "@/components/docs/ArticleView";
import { ChevronRight, Home } from "lucide-react";

export function generateStaticParams() {
  const articles = loadAllArticles();
  const params: { role: string; slug: string }[] = [];
  for (const article of Object.values(articles)) {
    const dashIndex = article.id.indexOf("-");
    if (dashIndex === -1) continue;
    const role = article.id.substring(0, dashIndex);
    const slug = article.id.substring(dashIndex + 1);
    params.push({ role, slug });
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ role: string; slug: string }>;
}) {
  const { role: roleParam, slug } = await params;
  if (!isValidRole(roleParam)) {
    return { title: "Not found" };
  }
  const articles = loadAllArticles();
  const article = getArticle(articles, `${roleParam}-${slug}`);
  if (!article) {
    return { title: "Not found" };
  }
  return {
    title: `${article.title} — ${getRoleLabel(roleParam as RoleId)} — e-Vitals Docs`,
    description: article.overview ?? article.description ?? article.title,
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ role: string; slug: string }>;
}) {
  const { role: roleParam, slug } = await params;

  if (!isValidRole(roleParam)) {
    notFound();
  }

  const role = roleParam as RoleId;
  const articles = loadAllArticles();
  const article = getArticle(articles, `${role}-${slug}`);

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <DocsHeader role={role} articles={articles} />
      <div className="mx-auto flex max-w-7xl gap-8 px-4 sm:px-6">
        <aside className="sticky top-[57px] hidden h-[calc(100vh-57px)] w-64 shrink-0 lg:block">
          <ArticleSidebar role={role} article={article} />
        </aside>
        <div className="min-w-0 flex-1">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 pt-6 pb-2 text-xs text-muted-foreground"
          >
            <Link
              href={`/docs/${role}`}
              className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
            >
              <Home className="h-3 w-3" />
              <span>{getRoleLabel(role)}</span>
            </Link>
            {article.module && article.module !== article.title && (
              <>
                <ChevronRight className="h-3 w-3" />
                <span>{article.module}</span>
              </>
            )}
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium">{article.title}</span>
          </nav>
          <ArticleView article={article} />
        </div>
      </div>
    </div>
  );
}
