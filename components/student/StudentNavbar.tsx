"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import type { PlatformTheme } from "@/lib/themes";

interface StudentNavbarProps {
  platformName: string;
  slug: string;
  theme: PlatformTheme;
  whatsapp?: string;
}

export function StudentNavbar({
  platformName,
  slug,
  theme,
  whatsapp,
}: StudentNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const colors = theme.light;

  const basePath = `/p/${slug}`;

  const navLinks = [
    { label: "الرئيسية", href: basePath },
    { label: "جميع الكورسات", href: `${basePath}/courses` },
    { label: "عن المعلم", href: `${basePath}#about` },
    { label: "تواصل معنا", href: `${basePath}#contact` },
  ];

  return (
    <header
      className="sticky top-0 z-40 transition-colors duration-200 border-b backdrop-blur-md"
      style={{
        backgroundColor: `${colors.surface}F2`,
        borderColor: colors.border,
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Brand / Teacher Name */}
          <Link
            href={basePath}
            className="flex items-center gap-2.5 transition-transform hover:scale-[1.02]"
          >
            <div
              className="flex h-10 w-10 items-center justify-center font-black text-white shadow-sm"
              style={{
                backgroundColor: colors.primary,
                borderRadius: theme.radius.buttonCss,
              }}
            >
              <Icon name="graduation-cap" size={20} strokeWidth={2} />
            </div>
            <div className="flex flex-col">
              <span
                className="text-base sm:text-lg font-black tracking-tight"
                style={{
                  fontFamily: theme.fonts.display,
                  color: colors.textPrimary,
                }}
              >
                {platformName}
              </span>
              <span className="text-[11px] font-medium text-[#8A929B]">
                المنصة التعليمية الرسمية
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3.5 py-2 text-sm font-bold rounded-lg transition-colors"
                style={{ color: colors.textSecondary }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = colors.primary;
                  e.currentTarget.style.backgroundColor = `${colors.primary}10`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = colors.textSecondary;
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Right Action */}
          <div className="hidden sm:flex items-center gap-3">
            {whatsapp && (
              <a
                href={`https://wa.me/2${whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:opacity-95 active:scale-95"
                style={{
                  backgroundColor: "#25D366",
                  borderRadius: theme.radius.buttonCss,
                }}
              >
                <Icon name="phone" size={14} strokeWidth={2} />
                <span>تواصل واتساب</span>
              </a>
            )}

            <Link
              href={`${basePath}/courses`}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:opacity-95 active:scale-95"
              style={{
                backgroundColor: colors.accent,
                borderRadius: theme.radius.buttonCss,
                color: colors.primary,
              }}
            >
              <Icon name="book-open" size={14} strokeWidth={2} />
              <span>استكشف الكورسات</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl transition-colors border"
            style={{
              borderColor: colors.border,
              color: colors.textPrimary,
              backgroundColor: colors.surface,
            }}
            aria-label="القائمة الرئيسية"
          >
            <Icon
              name={mobileMenuOpen ? "x" : "list"}
              size={20}
              strokeWidth={2}
            />
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div
          className="md:hidden border-t px-4 pt-3 pb-6 space-y-2 shadow-lg"
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 text-sm font-bold rounded-xl transition-colors"
              style={{
                color: colors.textPrimary,
                backgroundColor: `${colors.border}40`,
              }}
            >
              {link.label}
            </Link>
          ))}

          <div className="pt-2 flex flex-col gap-2">
            {whatsapp && (
              <a
                href={`https://wa.me/2${whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 text-xs font-bold text-white rounded-xl shadow-sm"
                style={{ backgroundColor: "#25D366" }}
              >
                <Icon name="phone" size={14} strokeWidth={2} />
                <span>تواصل عبر واتساب</span>
              </a>
            )}

            <Link
              href={`${basePath}/courses`}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-3 text-xs font-bold rounded-xl shadow-sm"
              style={{
                backgroundColor: colors.accent,
                color: colors.primary,
              }}
            >
              <Icon name="book-open" size={14} strokeWidth={2} />
              <span>استكشف جميع الكورسات</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
