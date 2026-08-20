import type { Metadata } from "next";
import Link from "next/link";
import { careerItems, educationItems, techStackGroups, type TimelineItem } from "./about-data";

export const metadata: Metadata = {
  title: "About",
  description: "yongss와 이 블로그를 소개합니다.",
};

const contentAreas = [
  { href: "/research", label: "Research", title: "깊이 이해한 기술 기록", description: "운영체제와 개발 원리를 개념, 조건, 예시로 나누어 정리합니다." },
  { href: "/labs", label: "Interactive Labs", title: "직접 조작하는 실험", description: "글로만 이해하기 어려운 동작을 움직이는 시각화로 확인합니다." },
  { href: "/projects", label: "Projects", title: "문제를 해결한 과정", description: "문제 정의부터 기술 선택, 구현, 검증과 회고까지 기록할 예정입니다." },
] as const;

function Timeline({ emptyMessage, items }: { emptyMessage: string; items: TimelineItem[] }) {
  if (items.length === 0) {
    return <div className="about-section-empty"><strong>추가 예정</strong><p>{emptyMessage}</p></div>;
  }

  return (
    <ol className="about-timeline">
      {items.map((item) => (
        <li key={`${item.period}-${item.organization}-${item.title}`}>
          <span>{item.period}</span>
          <div>
            <small>{item.organization}</small>
            <h3>{item.title}</h3>
            {item.description ? <p>{item.description}</p> : null}
          </div>
        </li>
      ))}
    </ol>
  );
}

export default function AboutPage() {
  return (
    <main className="page-shell about-page">
      <p className="page-kicker">About</p>
      <h1 className="page-title">안녕하세요, 방용환입니다.</h1>
      <p className="page-description">
        더 나은 소프트웨어를 만들기 위해 공부하고 실험한 내용을 기록합니다.
        이곳에는 오래 참고할 수 있는 연구 노트와 프로젝트 회고를 쌓아갑니다.
      </p>
      <div className="content-divider" />

      <section className="about-section" aria-labelledby="about-records-title">
        <div className="about-section-heading">
          <p>What I record</p>
          <h2 id="about-records-title">이곳에 쌓는 기록</h2>
        </div>
        <div className="about-topic-grid">
          {contentAreas.map((area) => (
            <Link href={area.href} key={area.href}>
              <small>{area.label}</small>
              <h3>{area.title}</h3>
              <p>{area.description}</p>
              <span aria-hidden="true">→</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="about-section" aria-labelledby="about-career-title">
        <div className="about-section-heading">
          <p>Experience</p>
          <h2 id="about-career-title">경력</h2>
        </div>
        <Timeline emptyMessage="경력 내용을 정리하면 이곳에 기간순으로 표시됩니다." items={careerItems} />
      </section>

      <section className="about-section" aria-labelledby="about-stack-title">
        <div className="about-section-heading">
          <p>Tech stack</p>
          <h2 id="about-stack-title">기술 스택</h2>
        </div>
        {techStackGroups.length === 0 ? (
          <div className="about-section-empty"><strong>추가 예정</strong><p>기술 스택을 정리하면 카테고리별 목록으로 표시됩니다.</p></div>
        ) : (
          <div className="about-stack-grid">
            {techStackGroups.map((group) => (
              <article key={group.category}>
                <h3>{group.category}</h3>
                <ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="about-section" aria-labelledby="about-education-title">
        <div className="about-section-heading">
          <p>Education</p>
          <h2 id="about-education-title">교육</h2>
        </div>
        <Timeline emptyMessage="수료한 교육을 정리하면 이곳에 기간순으로 표시됩니다." items={educationItems} />
      </section>

      <section className="about-section" aria-labelledby="about-contact-title">
        <div className="about-section-heading">
          <p>Contact</p>
          <h2 id="about-contact-title">연락처</h2>
        </div>
        <div className="about-contact-links">
          <a href="https://github.com/yonghwan1998" rel="noopener noreferrer" target="_blank"><span><small>GitHub</small><strong>github.com/yonghwan1998</strong></span><i aria-hidden="true">↗</i></a>
          <a href="mailto:bbl737898@gmail.com"><span><small>Email</small><strong>bbl737898@gmail.com</strong></span><i aria-hidden="true">→</i></a>
        </div>
      </section>
    </main>
  );
}
