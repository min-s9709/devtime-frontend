import Modal from "@/components/common/modal";
import "@/styles/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DevTime",
  description: "개발자들을 위한 타이머 및 대시보드",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="font-sans">
        {children}
        <Modal />
      </body>
    </html>
  );
}
