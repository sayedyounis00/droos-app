import React from 'react';

export type IconName =
  | 'home'
  | 'book-open'
  | 'layers'
  | 'play'
  | 'pause'
  | 'play-circle'
  | 'video'
  | 'tv'
  | 'user'
  | 'users'
  | 'graduation-cap'
  | 'pencil'
  | 'edit'
  | 'eye'
  | 'palette'
  | 'lock'
  | 'unlock'
  | 'search'
  | 'x'
  | 'check'
  | 'check-circle'
  | 'plus'
  | 'trash'
  | 'rotate-ccw'
  | 'link'
  | 'external-link'
  | 'globe'
  | 'save'
  | 'copy'
  | 'alert-triangle'
  | 'alert-circle'
  | 'lightbulb'
  | 'star'
  | 'sparkles'
  | 'clock'
  | 'zap'
  | 'file-text'
  | 'paperclip'
  | 'list'
  | 'message-square'
  | 'phone'
  | 'mail'
  | 'map-pin'
  | 'info'
  | 'quote'
  | 'chevron-left'
  | 'chevron-right'
  | 'chevron-down'
  | 'arrow-right'
  | 'arrow-left'
  | 'filter'
  | 'shield-check';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number | string;
  strokeWidth?: number;
  className?: string;
}

export function Icon({
  name,
  size = 20,
  strokeWidth = 1.6,
  className = '',
  ...props
}: IconProps) {
  const renderPath = () => {
    switch (name) {
      case 'home':
        return (
          <>
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </>
        );
      case 'book-open':
        return (
          <>
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </>
        );
      case 'layers':
        return (
          <>
            <polygon points="12 2 2 7 12 12 22 7 12 2" />
            <polyline points="2 17 12 22 22 17" />
            <polyline points="2 12 12 17 22 12" />
          </>
        );
      case 'play':
        return <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" fillOpacity={0.15} />;
      case 'pause':
        return (
          <>
            <rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor" fillOpacity={0.15} />
            <rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor" fillOpacity={0.15} />
          </>
        );
      case 'play-circle':
        return (
          <>
            <circle cx="12" cy="12" r="10" />
            <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" fillOpacity={0.2} />
          </>
        );
      case 'video':
        return (
          <>
            <polygon points="23 7 16 12 23 17 23 7" />
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
          </>
        );
      case 'tv':
        return (
          <>
            <rect width="20" height="15" x="2" y="7" rx="2" />
            <polyline points="17 2 12 7 7 2" />
          </>
        );
      case 'user':
        return (
          <>
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </>
        );
      case 'users':
        return (
          <>
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </>
        );
      case 'graduation-cap':
        return (
          <>
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
          </>
        );
      case 'pencil':
      case 'edit':
        return (
          <>
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
            <path d="m15 5 4 4" />
          </>
        );
      case 'eye':
        return (
          <>
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
          </>
        );
      case 'palette':
        return (
          <>
            <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
            <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
            <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
            <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.563-2.512 5.563-5.563C22 6.5 17.5 2 12 2Z" />
          </>
        );
      case 'lock':
        return (
          <>
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </>
        );
      case 'unlock':
        return (
          <>
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 9.9-1" />
          </>
        );
      case 'search':
        return (
          <>
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </>
        );
      case 'x':
        return (
          <>
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </>
        );
      case 'check':
        return <polyline points="20 6 9 17 4 12" />;
      case 'check-circle':
        return (
          <>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </>
        );
      case 'plus':
        return (
          <>
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </>
        );
      case 'trash':
        return (
          <>
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          </>
        );
      case 'rotate-ccw':
        return (
          <>
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </>
        );
      case 'link':
        return (
          <>
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </>
        );
      case 'external-link':
        return (
          <>
            <path d="M15 3h6v6" />
            <path d="M10 14 21 3" />
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          </>
        );
      case 'globe':
        return (
          <>
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
            <path d="M2 12h20" />
          </>
        );
      case 'save':
        return (
          <>
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
            <polyline points="17 21 17 13 7 13 7 21" />
            <polyline points="7 3 7 8 15 8" />
          </>
        );
      case 'copy':
        return (
          <>
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
          </>
        );
      case 'alert-triangle':
        return (
          <>
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </>
        );
      case 'alert-circle':
        return (
          <>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </>
        );
      case 'lightbulb':
        return (
          <>
            <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
            <path d="M9 18h6" />
            <path d="M10 22h4" />
          </>
        );
      case 'star':
        return (
          <polygon
            points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
            fill="currentColor"
            fillOpacity={0.15}
          />
        );
      case 'sparkles':
        return (
          <>
            <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
            <path d="M5 3v4" />
            <path d="M19 17v4" />
          </>
        );
      case 'clock':
        return (
          <>
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </>
        );
      case 'zap':
        return <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="currentColor" fillOpacity={0.15} />;
      case 'file-text':
        return (
          <>
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <line x1="10" y1="9" x2="8" y2="9" />
          </>
        );
      case 'paperclip':
        return (
          <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l7.9-7.9" />
        );
      case 'list':
        return (
          <>
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
          </>
        );
      case 'message-square':
      case 'quote':
        return <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />;
      case 'phone':
        return (
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        );
      case 'mail':
        return (
          <>
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </>
        );
      case 'map-pin':
        return (
          <>
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </>
        );
      case 'info':
        return (
          <>
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </>
        );
      case 'chevron-left':
        return <path d="m15 18-6-6 6-6" />;
      case 'chevron-right':
        return <path d="m9 18 6-6-6-6" />;
      case 'chevron-down':
        return <path d="m6 9 6 6 6-6" />;
      case 'arrow-right':
        return (
          <>
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </>
        );
      case 'arrow-left':
        return (
          <>
            <path d="M19 12H5" />
            <path d="m12 19-7-7 7-7" />
          </>
        );
      case 'filter':
        return <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />;
      case 'shield-check':
        return (
          <>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            <path d="m9 12 2 2 4-4" />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`inline-block shrink-0 ${className}`}
      {...props}
    >
      {renderPath()}
    </svg>
  );
}

export type IconBadgeVariant =
  | 'primary'
  | 'accent'
  | 'success'
  | 'warning'
  | 'error'
  | 'neutral'
  | 'dark'
  | 'white';

export type IconBadgeSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface IconBadgeProps {
  name: IconName;
  variant?: IconBadgeVariant;
  size?: IconBadgeSize;
  className?: string;
  strokeWidth?: number;
}

const variantStyles: Record<IconBadgeVariant, string> = {
  primary: 'bg-[#EAF4F4] text-[#1F7A7B] border border-[#CFE6E6] shadow-sm shadow-[#1F7A7B]/5',
  accent: 'bg-[#FDF3E3] text-[#C88A22] border border-[#F3C97C]/60 shadow-sm shadow-[#E8A83C]/5',
  success: 'bg-[#E8F8EE] text-[#2E9E5B] border border-[#A7E5BF]',
  warning: 'bg-[#FDF3E3] text-[#E0A429] border border-[#F3C97C]',
  error: 'bg-[#FDF0ED] text-[#D9483D] border border-[#F6C5C0]',
  neutral: 'bg-[#F7F8F9] text-[#4A5158] border border-[#D3D7DC]',
  dark: 'bg-[#1B2227] text-[#EDEFF1] border border-[#2C353C]',
  white: 'bg-white text-[#1F7A7B] border border-[#EEF0F2] shadow-sm',
};

const sizeStyles: Record<IconBadgeSize, { container: string; iconSize: number }> = {
  xs: { container: 'h-6 w-6 rounded-lg', iconSize: 13 },
  sm: { container: 'h-8 w-8 rounded-xl', iconSize: 15 },
  md: { container: 'h-10 w-10 rounded-xl', iconSize: 18 },
  lg: { container: 'h-12 w-12 rounded-2xl', iconSize: 22 },
  xl: { container: 'h-14 w-14 rounded-2xl', iconSize: 26 },
};

export function IconBadge({
  name,
  variant = 'primary',
  size = 'md',
  className = '',
  strokeWidth = 1.6,
}: IconBadgeProps) {
  const { container, iconSize } = sizeStyles[size];
  const variantClass = variantStyles[variant];

  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 transition-transform ${container} ${variantClass} ${className}`}
    >
      <Icon name={name} size={iconSize} strokeWidth={strokeWidth} />
    </div>
  );
}
