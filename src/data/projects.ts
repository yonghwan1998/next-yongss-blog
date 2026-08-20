export type ProjectLink = {
  external?: boolean;
  href: string;
  label: string;
};

export type ProjectEntry = {
  description: string;
  links?: readonly ProjectLink[];
  period: string;
  preview?: {
    alt: string;
    height: number;
    src: string;
    width: number;
  };
  role?: string;
  technologies: readonly string[];
  title: string;
};

export const projectEntries: readonly ProjectEntry[] = [
  // {
  //   title: "프로젝트 이름",
  //   period: "YYYY.MM – YYYY.MM",
  //   role: "담당 역할",
  //   description: "해결한 문제와 핵심 성과를 간단히 작성합니다.",
  //   technologies: ["Next.js", "TypeScript"],
  //   links: [
  //     { label: "자세히 보기", href: "/projects/project-slug" },
  //     { label: "GitHub", href: "https://github.com/...", external: true },
  //   ],
  //   preview: {
  //     alt: "프로젝트 화면 설명",
  //     height: 720,
  //     src: "/images/projects/project-name/preview.png",
  //     width: 1280,
  //   },
  // },
];
