import type { Metadata } from "next";
import Link from "next/link";
import SemaphoreLab from "@/components/labs/SemaphoreLab";

export const metadata: Metadata = { title: "Semaphore Lab", description: "카운팅 세마포의 허가증 분배와 대기 큐를 직접 실험합니다." };

export default function SemaphoreLabPage() {
  return (
    <main className="page-shell lab-detail-page">
      <Link className="back-link" href="/labs">← Labs</Link>
      <p className="page-kicker">Lab 02 · Operating System</p>
      <h1 className="page-title">Semaphore</h1>
      <p className="page-description">세 개의 허가증을 여러 태스크가 나누어 사용합니다. wait와 signal을 실행하며 카운터, 실행 목록과 FIFO 대기 큐가 어떻게 변하는지 확인해 보세요.</p>
      <div className="content-divider" />
      <SemaphoreLab />
      <section className="lab-explanation">
        <h2>관찰할 점</h2>
        <ol>
          <li>허가증이 남아 있으면 여러 태스크가 동시에 실행할 수 있습니다.</li>
          <li>카운터가 0일 때 새로운 요청은 대기 큐로 이동합니다.</li>
          <li>signal로 허가증이 반환되면 기다리던 태스크가 즉시 넘겨받습니다.</li>
        </ol>
      </section>
    </main>
  );
}
