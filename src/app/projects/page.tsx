import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Projects",
  description: "직접 만들고 개선한 프로젝트를 소개합니다.",
};

export default function ProjectsPage() {
  return (
    <main className="page-shell">
      <p className="page-kicker">Projects</p>
      <h1 className="page-title">문제를 풀며 만든 것들</h1>
      <p className="page-description">
        설계 의도와 기술적 선택, 구현 과정에서 얻은 배움을 프로젝트별로
        기록합니다.
      </p>
      <div className="content-divider" />
      <section className="projects-empty-state" aria-labelledby="projects-status-title">
        <p className="projects-status"><span aria-hidden="true" /> Content in progress</p>
        <h2 id="projects-status-title">프로젝트 기록을 준비하고 있습니다</h2>
        <p className="projects-empty-description">
          결과만 나열하기보다 문제를 정의한 과정부터 기술적 선택과 검증, 개선점까지 설명할 수 있도록 내용을 정리한 뒤 공개할 예정입니다.
        </p>
        <ol className="projects-outline" aria-label="프로젝트 기록 구성">
          <li><span>01</span><strong>문제와 목표</strong><small>무엇을 해결하려 했는지</small></li>
          <li><span>02</span><strong>설계와 구현</strong><small>어떤 기준으로 기술을 선택했는지</small></li>
          <li><span>03</span><strong>검증과 회고</strong><small>결과와 다음 개선점은 무엇인지</small></li>
        </ol>
        <nav className="projects-empty-nav" aria-label="다른 콘텐츠 둘러보기">
          <p>그동안 아래 콘텐츠를 먼저 둘러볼 수 있습니다.</p>
          <div>
            <Link href="/research"><span><small>Research</small><strong>기술 탐구 글 읽기</strong></span><i aria-hidden="true">→</i></Link>
            <Link href="/labs"><span><small>Interactive Labs</small><strong>동작 직접 실험하기</strong></span><i aria-hidden="true">→</i></Link>
          </div>
        </nav>
      </section>
    </main>
  );
}
