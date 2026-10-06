import React from "react";
import { IconBadge, type IconName } from "@/components/ui/Icon";

interface EditorCardProps {
  title: string;
  icon: IconName | React.ReactNode;
  children: React.ReactNode;
}

export function EditorCard({ title, icon, children }: EditorCardProps) {
  return (
    <div className="w-full">
      <div className="mb-6 flex items-center gap-3">
        {typeof icon === "string" ? (
          <IconBadge name={icon as IconName} variant="primary" size="md" />
        ) : (
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF4F4] text-[#1F7A7B] border border-[#CFE6E6]">
            {icon}
          </span>
        )}
        <div>
          <h2 className="text-lg font-black text-[#1C2126]">{title}</h2>
          <p className="text-xs text-[#8A929B]">عدّل المحتوى وشاهد التغيير في المعاينة مباشرة</p>
        </div>
      </div>
      <div className="space-y-5">{children}</div>
    </div>
  );
}
