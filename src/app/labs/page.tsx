import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = { title: "Labs", description: "개발 원리를 움직이는 시각화로 탐구하는 실험실입니다." };

const labs = [
  {
    href: "/labs/mutex",
    number: "01",
    title: "Mutex",
    koreanTitle: "하나의 열쇠, 하나의 소유자",
    description: "락의 소유권과 FIFO 대기 큐를 조작하며 상호 배제가 어떻게 보장되는지 확인합니다.",
    preview: {
      alt: "프로세스가 뮤텍스를 획득하고 임계 구역을 사용한 뒤 다음 프로세스에 넘기는 과정",
      height: 459,
      src: "/images/synchronization-and-deadlock/mutex-demo.gif",
      width: 720,
    },
    tags: ["OS", "Concurrency"],
  },
  {
    href: "/labs/semaphore",
    number: "02",
    title: "Semaphore",
    koreanTitle: "여러 허가증, 제한된 동시 접근",
    description: "카운팅 세마포의 wait·signal 연산과 제한된 자원의 분배 과정을 확인합니다.",
    preview: {
      alt: "여러 프로세스가 세마포의 허가증을 획득하거나 기다렸다가 반환받는 과정",
      height: 669,
      src: "/images/synchronization-and-deadlock/semaphore-demo.gif",
      width: 720,
    },
    tags: ["OS", "Synchronization"],
  },
  {
    href: "/labs/scheduling-queue",
    number: "03",
    title: "Scheduling Queue",
    koreanTitle: "준비·실행·대기 큐의 상태 전이",
    description: "디스패치, 타이머 인터럽트, I/O 요청과 완료에 따라 PCB가 큐 사이를 이동하는 과정을 확인합니다.",
    preview: {
      alt: "프로세스가 준비 큐, CPU, 입출력 대기 큐 사이를 이동하는 과정",
      height: 679,
      src: "/images/cpu-scheduling/scheduling-queue-demo.gif",
      width: 720,
    },
    tags: ["OS", "Scheduling"],
  },
];

export default function LabsPage() {
  return (
    <main className="page-shell labs-page">
      <p className="page-kicker">Interactive Labs</p>
      <h1 className="page-title">움직임으로 이해하는 개발 원리</h1>
      <p className="page-description">각 실험의 상세 페이지에서 실행 흐름을 직접 조작할 수 있습니다. 같은 컴포넌트는 관련 Research 글에서도 사용됩니다.</p>
      <div className="content-divider" />
      <div className="lab-index-list">
        {labs.map((lab) => (
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
