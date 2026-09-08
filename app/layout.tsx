import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "700", "800", "900"],
  variable: "--font-tajawal",
  display: "swap",
});

export const metadata: Metadata = {
  title: "دروس — منصتك التعليمية المتكاملة للمعلمين والطلاب",
  description: "منصة متكاملة تتيح للمعلمين إنشاء منصتهم التعليمية الخاصة بسهولة، وإدارة الطلاب والمحتوى من مكان واحد دون الحاجة لخبرة تقنية.",
  keywords: ["منصة تعليمية", "معلم", "طالب", "دروس", "تعليم إلكتروني", "إدارة المحتوى"],
  authors: [{ name: "دروس" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${tajawal.variable} font-arabic h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-[#F7F8F9] text-[#1C2126] selection:bg-[#CFE6E6] selection:text-[#0F4E4F]">
        {children}
      </body>
    </html>
  );
}
