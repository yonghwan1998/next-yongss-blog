import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: { absolute: "yongss Blog" },
  description: "개발 원리를 글과 움직이는 실험으로 기록하는 yongss의 기술 블로그입니다.",
};

const recentResearch = [
  {
    category: "Operating System",
    date: "2026.08.20",
    description: "CPU·입출력 버스트와 스케줄링 큐부터 주요 CPU 스케줄링 알고리즘까지 정리합니다.",
    href: "/research/cpu-scheduling",
    title: "CPU 스케줄링",
  },
  {
    category: "Operating System",
    date: "2026.08.17",
    description: "레이스 컨디션부터 뮤텍스·세마포·모니터, 교착 상태 해결 방법까지 정리합니다.",
    href: "/research/synchronization-and-deadlock",
    title: "동기화와 교착 상태",
  },
] as const;

export default function HomePage() {
  return (
    <main className="page-shell home-page">
      <section className="home-hero">
        <p className="page-kicker">Research · Build · Explain</p>
        <h1 className="page-title">이해한 것을 글과 움직임으로 남깁니다.</h1>
        <p className="page-description">
          개발 원리를 끝까지 파고들어 정리하고, 눈으로 확인할 수 있는 실험으로 다시 설명합니다.
        </p>
        <div className="home-hero-actions">
          <Link className="home-primary-link" href="/research">Research 읽기 <span aria-hidden="true">→</span></Link>
          <Link className="home-secondary-link" href="/about">블로그 소개</Link>
        </div>
      </section>

      <div className="content-divider" />

      <section className="home-section" aria-labelledby="home-research-title">
        <div className="home-section-heading">
          <div>
            <p>Recently researched</p>
            <h2 id="home-research-title">최신 Research</h2>
          </div>
          <Link href="/research">전체 글 <span aria-hidden="true">→</span></Link>
        </div>
        <div className="home-research-grid">
          {recentResearch.map((article) => (
            <Link className="home-research-card" href={article.href} key={article.href}>
              <span>{article.category} · {article.date}</span>
              <h3>{article.title}</h3>
              <p>{article.description}</p>
              <strong>읽어보기 <i aria-hidden="true">→</i></strong>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-section" aria-labelledby="home-lab-title">
        <div className="home-section-heading">
          <div>
            <p>Featured experiment</p>
            <h2 id="home-lab-title">움직임으로 확인하기</h2>
          </div>
          <Link href="/labs">전체 Labs <span aria-hidden="true">→</span></Link>
        </div>
        <Link className="home-lab-feature" href="/labs/scheduling-queue">
          <span className="home-lab-content">
            <small>Operating System · Scheduling</small>
            <strong>Scheduling Queue</strong>
            <b>준비·실행·대기 큐의 상태 전이</b>
            <span>디스패치, 타이머 인터럽트와 입출력 요청에 따라 PCB가 이동하는 과정을 직접 조작할 수 있습니다.</span>
            <i>실험 시작하기 <em aria-hidden="true">→</em></i>
          </span>
          <span className="home-lab-preview">
            <Image
              alt="프로세스가 준비 큐, CPU, 입출력 대기 큐 사이를 이동하는 애니메이션"
              height={679}
              sizes="(max-width: 760px) calc(100vw - 72px), 290px"
              src="/images/cpu-scheduling/scheduling-queue-demo.gif"
              unoptimized
              width={720}
            />
          </span>
        </Link>
      </section>
    </main>
  );
}
