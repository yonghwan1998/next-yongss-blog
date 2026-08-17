import type { Metadata } from "next";
import LabCard from "@/components/LabCard";
import MutexVisual from "@/components/MutexVisual";

export const metadata: Metadata = {
  title: "Research",
  description: "기술을 깊이 탐구하고 정리한 글입니다.",
};

export default function ResearchPage() {
  return (
    <main className="page-shell">
      <p className="page-kicker">Research</p>
      <h1 className="page-title">깊이 이해하기 위한 기록</h1>
      <p className="page-description">
        운영체제, 백엔드, 인공지능 등 공부하며 파고든 주제를 정리합니다.
      </p>
      <div className="content-divider" />
      <p className="section-label">LATEST NOTE</p>
      <LabCard compact title="Mutex와 Semaphore" description="동시성 제어의 핵심 개념과 차이를 움직이는 예시와 함께 정리합니다." tags={["OS", "Concurrency"]}>
        <MutexVisual />
      </LabCard>
    </main>
  );
}
