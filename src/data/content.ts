export type ResearchArticle = {
  category: string;
  date: string;
  description: string;
  homeDescription?: string;
  href: string;
  title: string;
};

export type LabEntry = {
  category: string;
  description: string;
  featuredDescription?: string;
  href: string;
  koreanTitle: string;
  number: string;
  preview: {
    alt: string;
    featuredAlt?: string;
    height: number;
    src: string;
    width: number;
  };
  tags: readonly string[];
  title: string;
};

export const researchArticles: readonly ResearchArticle[] = [
  {
    category: "Operating System",
    date: "2026.08.20",
    description: "CPU·입출력 버스트와 스케줄링 큐부터 선점 여부, 주요 CPU 스케줄링 알고리즘까지 정리합니다.",
    homeDescription: "CPU·입출력 버스트와 스케줄링 큐부터 주요 CPU 스케줄링 알고리즘까지 정리합니다.",
    href: "/research/cpu-scheduling",
    title: "CPU 스케줄링",
  },
  {
    category: "Operating System",
    date: "2026.08.17",
    description: "레이스 컨디션부터 뮤텍스·세마포·모니터, 교착 상태 해결 방법까지 정리합니다.",
    href: "/research/synchronization-and-deadlock",
    title: "동기화와 교착 상태",
  },
];

const schedulingQueueLab: LabEntry = {
  category: "Operating System",
  description: "디스패치, 타이머 인터럽트, I/O 요청과 완료에 따라 PCB가 큐 사이를 이동하는 과정을 확인합니다.",
  featuredDescription: "디스패치, 타이머 인터럽트와 입출력 요청에 따라 PCB가 이동하는 과정을 직접 조작할 수 있습니다.",
  href: "/labs/scheduling-queue",
  koreanTitle: "준비·실행·대기 큐의 상태 전이",
  number: "03",
  preview: {
    alt: "프로세스가 준비 큐, CPU, 입출력 대기 큐 사이를 이동하는 과정",
    featuredAlt: "프로세스가 준비 큐, CPU, 입출력 대기 큐 사이를 이동하는 애니메이션",
    height: 679,
    src: "/images/cpu-scheduling/scheduling-queue-demo.gif",
    width: 720,
  },
  tags: ["OS", "Scheduling"],
  title: "Scheduling Queue",
};

export const labEntries: readonly LabEntry[] = [
  {
    category: "Operating System",
    description: "락의 소유권과 FIFO 대기 큐를 조작하며 상호 배제가 어떻게 보장되는지 확인합니다.",
    href: "/labs/mutex",
    koreanTitle: "하나의 열쇠, 하나의 소유자",
    number: "01",
    preview: {
      alt: "프로세스가 뮤텍스를 획득하고 임계 구역을 사용한 뒤 다음 프로세스에 넘기는 과정",
      height: 459,
      src: "/images/synchronization-and-deadlock/mutex-demo.gif",
      width: 720,
    },
    tags: ["OS", "Concurrency"],
    title: "Mutex",
  },
  {
    category: "Operating System",
    description: "카운팅 세마포의 wait·signal 연산과 제한된 자원의 분배 과정을 확인합니다.",
    href: "/labs/semaphore",
    koreanTitle: "여러 허가증, 제한된 동시 접근",
    number: "02",
    preview: {
      alt: "여러 프로세스가 세마포의 허가증을 획득하거나 기다렸다가 반환받는 과정",
      height: 669,
      src: "/images/synchronization-and-deadlock/semaphore-demo.gif",
      width: 720,
    },
    tags: ["OS", "Synchronization"],
    title: "Semaphore",
  },
  schedulingQueueLab,
];

export const featuredLab = schedulingQueueLab;
