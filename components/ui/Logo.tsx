import React from 'react';
import Link from 'next/link';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  subtitle?: string;
  href?: string;
  className?: string;
}

const iconSizes = {
  sm: 'h-8 w-8 rounded-lg',
  md: 'h-10 w-10 rounded-xl',
  lg: 'h-12 w-12 rounded-2xl',
};

const svgSizes = {
  sm: 'h-5 w-5',
  md: 'h-6 w-6',
  lg: 'h-7 w-7',
};

const textSizes = {
  sm: 'text-base font-bold',
  md: 'text-lg font-bold',
  lg: 'text-2xl font-black',
};

export function Logo({
  size = 'md',
  showText = true,
  subtitle,
  href = '/',
  className = '',
}: LogoProps) {
  const content = (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div
        className={`flex ${iconSizes[size]} items-center justify-center bg-[#1F7A7B] text-white shadow-md shadow-[#1F7A7B]/20 transition-transform`}
      >
        <svg
          className={svgSizes[size]}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
          <path d="M6 6h10" />
          <path d="M6 10h10" />
          <path d="M6 14h6" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className={`${textSizes[size]} tracking-tight text-[#1C2126]`}>
            دُرُوس
          </span>
          {subtitle && (
            <span className="text-[10px] font-medium text-[#1F7A7B]">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (!href) {
    return content;
  }

  return (
    <Link href={href} className="inline-flex transition-transform hover:scale-[1.02]">
      {content}
    </Link>
  );
}
