"use client";

import { useEffect, useState } from "react";

type TocItem = { id: string; title: string };

type TableOfContentsProps = {
  contentSelector?: string;
  headingSelector?: string;
  title?: string;
};

function toHeadingId(title: string, index: number) {
  const slug = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  return slug || `section-${index + 1}`;
}

export default function TableOfContents({
  contentSelector = ".article-shell",
  headingSelector = ".article-section > h2",
  title = "목차",
}: TableOfContentsProps) {
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    let observer: IntersectionObserver | undefined;
    const frame = requestAnimationFrame(() => {
      const content = document.querySelector(contentSelector);
      if (!content) return;

      const headings = Array.from(content.querySelectorAll<HTMLHeadingElement>(headingSelector));
      const nextItems = headings.map((heading, index) => {
        const id = heading.id || toHeadingId(heading.textContent ?? "", index);
        heading.id = id;
        return { id, title: heading.textContent?.trim() || `Section ${index + 1}` };
      });

      setItems(nextItems);
      setActiveId(nextItems[0]?.id ?? "");

      observer = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];

          if (visible) setActiveId(visible.target.id);
        },
        { rootMargin: "-18% 0px -70% 0px", threshold: 0 },
      );

      headings.forEach((heading) => observer?.observe(heading));
    });

    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, [contentSelector, headingSelector]);

  if (!items.length) return null;

  return (
    <aside className="table-of-contents" aria-label={title}>
      <strong>{title}</strong>
      <nav>
        {items.map((item) => (
          <a
            aria-current={activeId === item.id ? "location" : undefined}
            className={activeId === item.id ? "active" : undefined}
            href={`#${item.id}`}
            key={item.id}
          >
            {item.title}
          </a>
        ))}
      </nav>
    </aside>
  );
}
