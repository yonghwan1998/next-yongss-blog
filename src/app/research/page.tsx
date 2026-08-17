import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Research", description: "기술을 깊이 탐구하고 정리한 글입니다." };

export default function ResearchPage() {
  return (
    <main className="page-shell">
      <p className="page-kicker">Research</p>
      <h1 className="page-title">깊이 이해하기 위한 기록</h1>
      <p className="page-description">운영체제, 백엔드, 인공지능 등 공부하며 파고든 주제를 정리합니다.</p>
      <div className="content-divider" />
      <Link className="research-item" href="/research/synchronization-and-deadlock">
        <span>Operating System · 2026.08.17</span>
        <h2>동기화와 교착 상태</h2>
        <p>레이스 컨디션부터 뮤텍스·세마포·모니터, 교착 상태 해결 방법까지 정리합니다.</p>
        <strong>읽어보기 →</strong>
      </Link>
    </main>
  );
}
