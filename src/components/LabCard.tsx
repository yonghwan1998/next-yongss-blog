import Link from "next/link";
import type { ReactNode } from "react";

type LabCardProps = { title: string; description: string; tags: string[]; href?: string; children: ReactNode; compact?: boolean; };

export default function LabCard({ title, description, tags, href = "/labs", children, compact = false }: LabCardProps) {
  return (
    <article className={`lab-card${compact ? " lab-card-compact" : ""}`}>
      <div className="lab-stage">{children}</div>
      <div className="lab-body">
        <div className="tag-row">{tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        <h2>{title}</h2><p>{description}</p>
        <Link className="text-link" href={href}>실험 살펴보기 <span>→</span></Link>
      </div>
    </article>
  );
}
