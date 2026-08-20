import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "yongss와 이 연구소를 소개합니다.",
};

export default function AboutIndexPage() {
  return (
    <main className="page-shell">
      <p className="page-kicker">About</p>
      <h1 className="page-title">안녕하세요, 방용환입니다.</h1>
      <p className="page-description">
        더 나은 소프트웨어를 만들기 위해 공부하고 실험한 내용을 기록합니다.
        이곳에는 오래 참고할 수 있는 연구 노트와 프로젝트 회고를 쌓아갑니다.
      </p>
      <div className="content-divider" />
      <div className="about-note">
        <span>THIS SPACE IS FOR</span>
        <p>깊게 이해한 지식, 다시 꺼내 볼 기록, 그리고 누군가에게 도움이 될 작은 실험.</p>
      </div>
    </main>
  );
}
