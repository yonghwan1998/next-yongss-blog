import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { labEntries } from "@/data/content";

export const metadata: Metadata = { title: "Labs", description: "개발 원리를 움직이는 시각화로 탐구하는 실험실입니다." };

export default function LabsPage() {
  return (
    <main className="page-shell labs-page">
      <p className="page-kicker">Interactive Labs</p>
      <h1 className="page-title">움직임으로 이해하는 개발 원리</h1>
      <p className="page-description">각 실험의 상세 페이지에서 실행 흐름을 직접 조작할 수 있습니다. 같은 컴포넌트는 관련 Research 글에서도 사용됩니다.</p>
      <div className="content-divider" />
      <div className="lab-index-list">
        {labEntries.map((lab) => (
          <Link className="lab-index-item" href={lab.href} key={lab.href}>
            <span className="lab-index-number">{lab.number}</span>
            <div className="lab-index-content">
              <div className="lab-index-tags">{lab.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
              <h2>{lab.title}</h2>
              <h3>{lab.koreanTitle}</h3>
              <p>{lab.description}</p>
            </div>
            <span className="lab-index-preview">
              <Image
                alt={lab.preview.alt}
                height={lab.preview.height}
                sizes="(max-width: 760px) calc(100vw - 112px), 190px"
                src={lab.preview.src}
                unoptimized
                width={lab.preview.width}
              />
            </span>
            <span className="lab-index-arrow" aria-hidden="true">→</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
