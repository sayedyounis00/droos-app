import { Icon } from "@/components/ui/Icon";

export function DbStatusBadge({ countText }: { countText: string }) {
  return (
    <div className="rounded-2xl border border-[#CFE6E6] bg-[#EAF4F4]/70 p-4 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
      <div className="flex items-center gap-2">
        <Icon name="zap" size={14} className="text-[#1F7A7B]" />
        <span className="font-bold text-[#0F4E4F]">
          مربوط بقاعدة البيانات: {countText}
        </span>
      </div>
      <span className="text-[10px] bg-white text-[#1F7A7B] font-black px-2.5 py-1 rounded-full border border-[#7EB8B9] self-start sm:self-auto inline-flex items-center gap-1">
        <span>بيانات فعلية</span>
        <Icon name="check" size={11} strokeWidth={2.5} />
      </span>
    </div>
  );
}
