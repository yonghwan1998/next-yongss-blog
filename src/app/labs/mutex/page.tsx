import type { Metadata } from "next";
import Link from "next/link";
import MutexLab from "@/components/labs/MutexLab";

export const metadata: Metadata = { title: "Mutex Lab", description: "뮤텍스의 락 소유권과 대기 큐를 직접 실험합니다." };

export default function MutexLabPage() {
  return (
    <main className="page-shell lab-detail-page">
      <Link className="back-link" href="/labs">← Labs</Link>
      <p className="page-kicker">Lab 01 · Operating System</p>
      <h1 className="page-title">Mutex</h1>
      <p className="page-description">하나의 공유 자원에는 한 번에 하나의 프로세스만 진입할 수 있습니다. 락을 획득하고 해제하면서 소유권과 FIFO 대기 큐의 변화를 확인해 보세요.</p>
      <div className="content-divider" />
      <MutexLab />
      <section className="lab-explanation">
        <h2>관찰할 점</h2>
        <ol>
          <li>락이 비어 있을 때 첫 프로세스가 즉시 임계 구역에 진입합니다.</li>
          <li>락이 잠긴 동안 들어온 프로세스는 FIFO 대기 큐에 쌓입니다.</li>
          <li>소유자가 락을 해제하면 가장 먼저 기다린 프로세스가 락을 넘겨받습니다.</li>
        </ol>
      </section>
    </main>
  );
}
