import React from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import type { PlatformTheme } from "@/lib/themes";
import type { ContactSection } from "@/components/teacher/home-page-builder/types";

interface StudentFooterProps {
  platformName: string;
  slug: string;
  theme: PlatformTheme;
  contact?: ContactSection;
  subject?: string | null;
}

export function StudentFooter({
  platformName,
  slug,
  theme,
  contact,
  subject,
}: StudentFooterProps) {
  const colors = theme.light;
  const basePath = `/p/${slug}`;

  return (
    <footer
      className="border-t transition-colors duration-200 text-sm"
      style={{
        backgroundColor: colors.surface,
        borderColor: colors.border,
        color: colors.textSecondary,
      }}
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Column 1: Teacher & Platform Overview */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div
                className="flex h-9 w-9 items-center justify-center font-bold text-white shadow-xs"
                style={{
                  backgroundColor: colors.primary,
                  borderRadius: theme.radius.buttonCss,
                }}
              >
                <Icon name="graduation-cap" size={18} strokeWidth={2} />
              </div>
              <span
                className="text-base font-black"
                style={{
                  fontFamily: theme.fonts.display,
                  color: colors.textPrimary,
                }}
              >
                {platformName}
              </span>
            </div>
            <p className="text-xs leading-relaxed max-w-sm text-[#5B6270]">
              منصة تعليمية متخصصة في مادة {subject || "التعليم الثانوي"} — شرح مبسط ومتابعة مستمرة لضمان تحقيق أعلى الدرجات والتفوق.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4
              className="text-xs font-black uppercase tracking-wider"
              style={{ color: colors.textPrimary }}
            >
              روابط سريعة
            </h4>
            <ul className="space-y-2 text-xs font-bold">
              <li>
                <Link
                  href={basePath}
                  className="hover:underline transition-colors"
                  style={{ color: colors.textSecondary }}
                >
                  الصفحة الرئيسية
                </Link>
              </li>
              <li>
                <Link
                  href={`${basePath}/courses`}
                  className="hover:underline transition-colors"
                  style={{ color: colors.textSecondary }}
                >
                  جميع الكورسات والوحدات
                </Link>
              </li>
              <li>
                <Link
                  href={`${basePath}#about`}
                  className="hover:underline transition-colors"
                  style={{ color: colors.textSecondary }}
                >
                  عن المعلم وطريقة التدريس
                </Link>
              </li>
              <li>
                <Link
                  href={`${basePath}#contact`}
                  className="hover:underline transition-colors"
                  style={{ color: colors.textSecondary }}
                >
                  قنوات التواصل والاستفسارات
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Support */}
          <div className="space-y-3">
            <h4
              className="text-xs font-black uppercase tracking-wider"
              style={{ color: colors.textPrimary }}
            >
              الدعم والتواصل
            </h4>
            <div className="space-y-2 text-xs">
              {contact?.phone && (
                <div className="flex items-center gap-2">
                  <Icon name="phone" size={14} className="text-[#1F7A7B]" />
                  <span className="font-bold text-[#1C2126] dir-ltr">
                    {contact.phone}
                  </span>
                </div>
              )}
              {contact?.whatsapp && (
                <div className="flex items-center gap-2">
                  <Icon name="message-square" size={14} className="text-[#25D366]" />
                  <span>واتساب: </span>
                  <a
                    href={`https://wa.me/2${contact.whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-[#25D366] hover:underline dir-ltr"
                  >
                    {contact.whatsapp}
                  </a>
                </div>
              )}
              {contact?.note && (
                <p className="text-[11px] text-[#8A929B] leading-relaxed pt-1">
                  {contact.note}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Droos badge */}
        <div
          className="mt-10 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs"
          style={{ borderColor: colors.border }}
        >
          <p className="text-[#8A929B]">
            جميع الحقوق محفوظة © {new Date().getFullYear()} {platformName}.
          </p>

          <div className="flex items-center gap-1.5 text-[11px] text-[#8A929B]">
            <span>مدعوم بواسطة</span>
            <span className="font-black text-[#1F7A7B]">منصة دروس (Droos)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
