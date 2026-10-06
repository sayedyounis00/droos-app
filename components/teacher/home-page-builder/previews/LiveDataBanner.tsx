import { Icon } from "@/components/ui/Icon";

interface LiveDataBannerProps {
  isLiveData?: boolean;
  message: string;
  badge?: string;
}

export function LiveDataBanner({
  isLiveData,
  message,
  badge = "قاعدة البيانات",
}: LiveDataBannerProps) {
  if (!isLiveData) return null;

  return (
    <div className="bg-[#0A3536] text-white px-4 py-2 text-xs font-bold flex items-center justify-between border-b border-white/10">
      <div className="flex items-center gap-2">
        <Icon name="check-circle" size={14} className="text-[#2E9E5B]" />
        <span>{message}</span>
      </div>
      <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">
        {badge}
      </span>
    </div>
  );
}
