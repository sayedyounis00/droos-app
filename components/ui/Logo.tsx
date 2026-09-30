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
  md: 'text-xl font-bold',
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
        className={`flex ${iconSizes[size]} items-center justify-center bg-[#1F7A7B] text-white shadow-sm shadow-[#1F7A7B]/20 transition-transform`}
      >
        <svg
          className={svgSizes[size]}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
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
