import Link from "next/link";

export default function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="site-name" href="/">yongss 연구소</Link>
        <p className="site-tagline">눈에 보이게 연구한다</p>
      </div>
    </header>
  );
}
