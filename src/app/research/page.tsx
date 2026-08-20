import type { Metadata } from "next";
import Link from "next/link";

import { researchArticles } from "@/data/content";

export const metadata: Metadata = { title: "Research", description: "기술을 깊이 탐구하고 정리한 글입니다." };

export default function ResearchPage() {
  return (
    <main className="page-shell">
      <p className="page-kicker">Research</p>
      <h1 className="page-title">깊이 이해하기 위한 기록</h1>
      <p className="page-description">운영체제, 백엔드, 인공지능 등 공부하며 파고든 주제를 정리합니다.</p>
      <div className="content-divider" />
      {researchArticles.map((article) => (
        <Link className="research-item" href={article.href} key={article.href}>
          <span>{article.category} · {article.date}</span>
          <h2>{article.title}</h2>
          <p>{article.description}</p>
          <strong>읽어보기 →</strong>
        </Link>
      ))}
    </main>
  );
}
