"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects", count: 0 },
  { href: "/research", label: "Research", count: 2 },
  { href: "/labs", label: "Labs", count: 3 },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="sidebar-sticky">
        <div className="profile-image" aria-label="프로필 이미지 자리">Y</div>
        <dl className="contact-list">
          <div><dt>github</dt><dd>—</dd></div>
          <div><dt>email</dt><dd>—</dd></div>
        </dl>
        <nav className="side-nav" aria-label="주요 메뉴">
          {navigation.map((item) => {
            const isActive = item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link aria-current={isActive ? "page" : undefined} href={item.href} key={item.href}>
                {item.label}{item.count !== undefined && ` (${item.count})`}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
