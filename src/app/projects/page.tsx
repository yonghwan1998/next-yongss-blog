import type { Metadata } from "next";

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
      <div className="empty-state">프로젝트를 정리해 곧 추가할 예정입니다.</div>
    </main>
  );
}
