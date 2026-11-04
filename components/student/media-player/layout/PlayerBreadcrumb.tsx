"use client";

import React from "react";
import Link from "next/link";

interface PlayerBreadcrumbProps {
  basePath: string;
  courseTitle?: string;
  moduleTitle?: string;
  primaryColor: string;
  surfaceColor: string;
  borderColor: string;
}

/**
 * Breadcrumb navigation bar at the top of the lesson player.
 */
export function PlayerBreadcrumb({
  basePath,
  courseTitle,
  moduleTitle,
  primaryColor,
  surfaceColor,
  borderColor,
}: PlayerBreadcrumbProps) {
  return (
    <div
      className="py-3 px-4 sm:px-6 lg:px-8 border-b text-xs font-medium"
      style={{ backgroundColor: surfaceColor, borderColor }}
    >
      <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[#8A929B]">
          <Link href={basePath} className="hover:text-[#1F7A7B] transition-colors">
            الرئيسية
          </Link>
          <span>/</span>
          <Link href={`${basePath}/courses`} className="hover:text-[#1F7A7B] transition-colors">
            الكورسات
          </Link>
          {courseTitle && (
            <>
              <span>/</span>
              <span className="text-[#4A5158] font-bold">{courseTitle}</span>
            </>
          )}
          {moduleTitle && (
            <>
              <span>/</span>
              <span style={{ color: primaryColor }} className="font-bold">
                {moduleTitle}
              </span>
            </>
          )}
        </div>

        <span className="text-[11px] text-[#8A929B] font-bold flex items-center gap-1.5">
          <svg
            width={13}
            height={13}
            viewBox="0 0 24 24"
            fill="none"
            stroke="#1F7A7B"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="23 7 16 12 23 17 23 7" />
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
          </svg>
          <span>مشغل الدروس</span>
        </span>
      </div>
    </div>
  );
}
