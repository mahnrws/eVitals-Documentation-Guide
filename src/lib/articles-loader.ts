import fs from "fs";
import path from "path";
import type { Article } from "./articles";

export function loadAllArticles(): Record<string, Article> {
  const articlesDir = path.join(process.cwd(), "src", "data", "articles");
  const files = fs.readdirSync(articlesDir).filter((f) => f.endsWith(".json"));
  const articles: Record<string, Article> = {};
  for (const file of files) {
    const content = fs.readFileSync(path.join(articlesDir, file), "utf-8");
    const article: Article = JSON.parse(content);
    articles[article.id] = article;
  }
  return articles;
}
