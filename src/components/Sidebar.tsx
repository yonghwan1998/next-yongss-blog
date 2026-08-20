"use client";

import Image from "next/image";
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
        <div className="profile-image">
          <Image
            alt="방용환 프로필 사진"
            height={1484}
            preload
            sizes="(max-width: 760px) 70px, 100px"
            src="/images/profile/profile.jpg"
            width={1112}
          />
        </div>
        <dl className="contact-list">
          <div>
            <dt>github</dt>
            <dd><a aria-label="yonghwan1998 GitHub 프로필을 새 탭에서 열기" href="https://github.com/yonghwan1998" rel="noopener noreferrer" target="_blank">yonghwan1998 <span aria-hidden="true">↗</span></a></dd>
          </div>
          <div>
            <dt>email</dt>
            <dd><a href="mailto:bbl737898@gmail.com">bbl737898@gmail.com</a></dd>
          </div>
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
