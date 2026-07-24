import type { Article } from "@/lib/articles";
import { Clock } from "lucide-react";

type ArticleWithShots = Article & { screenshots?: string[] };

export function ArticleView({ article }: { article: ArticleWithShots }) {
  return (
    <article className="mx-auto max-w-3xl py-10">
      <header className="mb-10">
        {article.module && (
          <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-brand">
            {article.module}
          </div>
        )}
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {article.title}
        </h1>
        {article.overview && (
          <p className="mt-4 text-base leading-relaxed text-muted-foreground max-w-2xl">
            {article.overview}
          </p>
        )}
        <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          {article.lastUpdated && (
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> Updated {article.lastUpdated}
            </span>
          )}
          {article.estimatedReadingTime && <span>{article.estimatedReadingTime} read</span>}
          {article.category && <span>&middot; {article.category}</span>}
        </div>
      </header>

      {article.screenshots && article.screenshots.length > 0 && (
        <div className="mb-12 grid gap-4">
          {article.screenshots.map((src) => (
            <figure key={src} className="overflow-hidden rounded-xl border border-[#d8e6f5] bg-white transition-all duration-[400ms] hover:shadow-[0_8px_32px_-8px_rgba(80,150,220,0.12)]">
              <img src={`/manual/${src}`} alt={`${article.title} overview`} loading="lazy" className="block w-full" />
            </figure>
          ))}
        </div>
      )}

      <div className="space-y-14">
        {article.subtasks.map((st, i) => (
          <section key={st.id} id={st.id} className="scroll-mt-24">
            <div className="mb-5">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                {st.title}
              </h2>
              {st.purpose && (
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground max-w-2xl">
                  {st.purpose}
                </p>
              )}
            </div>

            {st.steps.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">Steps</h3>
                <ol className="space-y-3">
                  {st.steps.map((s) => (
                    <li
                      key={s.stepNumber}
                      className="flex gap-4 rounded-xl border border-[#d8e6f5] bg-white p-5 transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:shadow-[0_8px_32px_-8px_rgba(80,150,220,0.12)] hover:border-[#c8ddf0] hover:-translate-y-0.5"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-sm font-semibold text-muted-foreground">
                        {s.stepNumber}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-foreground">{s.title}</div>
                        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                          {s.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {st.screenshots && st.screenshots.length > 0 && (
              <div className="mt-8 grid gap-4">
                  {st.screenshots.map((src) => (
                    <figure
                      key={src}
                      className="overflow-hidden rounded-xl border border-border bg-white"
                    >
                      <img
                        src={`/manual/${src}`}
                        alt={`${st.title} screenshot`}
                        loading="lazy"
                        className="block w-full"
                      />
                    </figure>
                  ))}
              </div>
            )}
          </section>
        ))}
      </div>
    </article>
  );
}
