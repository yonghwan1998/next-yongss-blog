import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="site-name" href="/">
          <Image
            alt=""
            aria-hidden="true"
            className="site-logo"
            height={34}
            priority
            src="/images/brand/yongss-circuit-mark.png"
            width={34}
          />
          <span>yongss 연구소</span>
        </Link>
        <p className="site-tagline">눈에 보이게 연구한다</p>
      </div>
    </header>
  );
}
