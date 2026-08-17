import type { Metadata } from "next";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Yongss Blog",
    template: "%s | Yongss Blog",
  },
  description: "Research, development, and notes by Yongss.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <Header />
        <div className="site-layout">
          <Sidebar />
          <div className="site-content">{children}</div>
        </div>
      </body>
    </html>
  );
}
