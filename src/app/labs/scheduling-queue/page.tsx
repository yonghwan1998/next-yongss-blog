import type { Metadata } from "next";
import Link from "next/link";
import SchedulingQueueLab from "@/components/labs/SchedulingQueueLab";

export const metadata: Metadata = {
  title: "Scheduling Queue Lab",
  description: "CPU 스케줄링의 준비·실행·대기·종료 상태와 장치별 큐 이동을 직접 실험합니다.",
};

export default function SchedulingQueueLabPage() {
  return (
    <main className="page-shell lab-detail-page">
      <Link className="back-link" href="/labs">← Labs</Link>
      <p className="page-kicker">Lab 03 · Operating System</p>
      <h1 className="page-title">Scheduling Queue</h1>
      <p className="page-description">프로세스는 CPU를 기다리는 준비 큐와 장치별 I/O 대기 큐 사이를 이동합니다. 디스패치와 인터럽트를 직접 발생시키며 각 상태 전이와 FIFO 순서를 확인해 보세요.</p>
      <div className="content-divider" />
      <SchedulingQueueLab />
      <section className="lab-explanation">
        <h2>관찰할 점</h2>
        <ol>
          <li>디스패처는 준비 큐의 선두 프로세스 하나만 CPU에 할당합니다.</li>
          <li>타이머 인터럽트가 발생하면 실행 중인 프로세스는 준비 큐의 맨 뒤로 이동합니다.</li>
          <li>I/O를 요청한 프로세스는 장치별 대기 큐로 이동하고, I/O 완료 인터럽트 후 준비 큐로 돌아옵니다.</li>
          <li>CPU 작업을 모두 마친 프로세스는 종료 상태가 되어 스케줄링 대상에서 제외됩니다.</li>
        </ol>
      </section>
    </main>
  );
}
