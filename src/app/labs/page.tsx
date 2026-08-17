import type { Metadata } from "next";
import LabCard from "@/components/LabCard";
import MutexVisual from "@/components/MutexVisual";

export const metadata: Metadata = { title: "Labs", description: "개발 원리를 움직이는 시각화로 탐구하는 실험실입니다." };

export default function LabsPage() {
  return (
    <main className="page-shell">
      <p className="page-kicker">Interactive Labs</p>
      <h1 className="page-title">움직임으로 이해하는<br />개발 원리</h1>
      <p className="page-description">글로만은 모호했던 흐름을 직접 보고 조작할 수 있는 작은 실험들입니다. 같은 시각화는 Research 글 안에서도 다시 사용됩니다.</p>
      <div className="content-divider" />
      <LabCard title="Mutex & Critical Section" description="두 프로세스가 하나의 공유 자원에 접근할 때 락이 진입 순서를 어떻게 제어하는지 관찰합니다." tags={["OS", "Concurrency", "Animation"]}>
        <MutexVisual />
      </LabCard>
    </main>
  );
}
