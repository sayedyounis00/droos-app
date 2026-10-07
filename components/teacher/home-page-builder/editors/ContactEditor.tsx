import { Icon } from "@/components/ui/Icon";
import { SocialIcon } from "@/components/ui/SocialIcon";
import type { ContactSection, SocialLink, SocialPlatform } from "../types";
import { EditorCard } from "./EditorCard";
import { InputField } from "./InputField";

// ─── Platform config ──────────────────────────────────────────────────────────
export const PLATFORM_CONFIG: Record<
  SocialPlatform,
  { label: string; placeholder: string }
> = {
  whatsapp:  { label: "واتساب",           placeholder: "01XXXXXXXXX أو رابط wa.me" },
  phone:     { label: "رقم الهاتف",       placeholder: "01XXXXXXXXX" },
  telegram:  { label: "تيليجرام",         placeholder: "@username أو رابط" },
  facebook:  { label: "فيسبوك",           placeholder: "رابط الصفحة أو الحساب" },
  instagram: { label: "إنستجرام",         placeholder: "رابط الحساب" },
  youtube:   { label: "يوتيوب",           placeholder: "رابط القناة" },
  tiktok:    { label: "تيك توك",          placeholder: "رابط الحساب" },
  twitter:   { label: "تويتر / X",        placeholder: "رابط الحساب" },
  website:   { label: "الموقع الإلكتروني", placeholder: "https://..." },
  email:     { label: "البريد الإلكتروني", placeholder: "example@gmail.com" },
  other:     { label: "رابط آخر",         placeholder: "رابط أو بيانات تواصل..." },
};

export const PLATFORM_ORDER: SocialPlatform[] = [
  "whatsapp",
  "phone",
  "telegram",
  "facebook",
  "instagram",
  "youtube",
  "tiktok",
  "twitter",
  "website",
  "email",
  "other",
];

interface ContactEditorProps {
  data: ContactSection;
  onChange: (data: ContactSection) => void;
}

export function ContactEditor({ data, onChange }: ContactEditorProps) {
  // Ensure we always have an editable list of socials
  const socials: SocialLink[] =
    data.socials && data.socials.length > 0
      ? data.socials
      : [
          ...(data.phone ? [{ platform: "phone" as SocialPlatform, value: data.phone, label: "الهاتف الأساسي" }] : []),
          ...(data.whatsapp ? [{ platform: "whatsapp" as SocialPlatform, value: data.whatsapp, label: "واتساب" }] : []),
        ].length > 0
      ? [
          ...(data.phone ? [{ platform: "phone" as SocialPlatform, value: data.phone, label: "الهاتف الأساسي" }] : []),
          ...(data.whatsapp ? [{ platform: "whatsapp" as SocialPlatform, value: data.whatsapp, label: "واتساب" }] : []),
        ]
      : [
          { platform: "whatsapp", value: "", label: "واتساب" },
          { platform: "phone", value: "", label: "رقم الهاتف" },
        ];

  const updateSocials = (updated: SocialLink[]) => {
    const firstPhone = updated.find((s) => s.platform === "phone")?.value ?? data.phone ?? "";
    const firstWhatsapp = updated.find((s) => s.platform === "whatsapp")?.value ?? data.whatsapp ?? "";
    onChange({
      ...data,
      socials: updated,
      phone: firstPhone,
      whatsapp: firstWhatsapp,
    });
  };

  const updateLink = (idx: number, field: keyof SocialLink, value: string) => {
    const current = socials[idx];
    let patch: Partial<SocialLink> = { [field]: value };

    // When the platform changes, auto-update the label to the new platform's
    // default label — unless the user has set a custom label different from
    // the old platform's default.
    if (field === "platform") {
      const oldDefaultLabel = PLATFORM_CONFIG[current.platform]?.label ?? "";
      const isUsingDefaultLabel =
        !current.label || current.label === oldDefaultLabel;
      if (isUsingDefaultLabel) {
        patch.label = PLATFORM_CONFIG[value as SocialPlatform]?.label ?? "";
      }
    }

    const next = socials.map((s, i) =>
      i === idx ? { ...s, ...patch } : s
    );
    updateSocials(next);
  };

  const addLink = () => {
    const defaultPlatform: SocialPlatform = "whatsapp";
    updateSocials([
      ...socials,
      {
        platform: defaultPlatform,
        value: "",
        label: PLATFORM_CONFIG[defaultPlatform].label,
      },
    ]);
  };

  const removeLink = (idx: number) => {
    updateSocials(socials.filter((_, i) => i !== idx));
  };

  return (
    <EditorCard title="معلومات ووسائل التواصل" icon="phone">
      <InputField
        label="عنوان قسم التواصل"
        value={data.title ?? "تواصل معنا"}
        onChange={(v) => onChange({ ...data, title: v })}
        placeholder="تواصل معنا"
      />

      {/* Social Links List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-[#1C2126]">
            قنوات وحسابات التواصل (يمكن إضافة أي عدد من الوسائل):
          </label>
          <span className="text-[11px] font-bold text-[#1F7A7B] bg-[#EAF4F4] px-2.5 py-0.5 rounded-full">
            {socials.length} وسائل مضافة
          </span>
        </div>

        {socials.map((link, idx) => {
          const cfg = PLATFORM_CONFIG[link.platform] || PLATFORM_CONFIG.other;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-[#EEF0F2] bg-[#F7F8F9] p-4 space-y-3.5 shadow-2xs hover:border-[#CFE6E6] transition-all"
            >
              {/* Header row with professional SVG icon */}
              <div className="flex items-center justify-between gap-2 border-b border-[#EEF0F2] pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white border border-[#D3D7DC] text-[#1F7A7B] shadow-2xs">
                    <SocialIcon platform={link.platform} size={15} />
                  </div>
                  <span className="text-xs font-black text-[#1C2126]">
                    {link.label || cfg.label}
                  </span>
                  <span className="text-[10px] font-bold text-[#8A929B] bg-white px-2 py-0.5 rounded-full border border-[#EEF0F2]">
                    #{idx + 1}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeLink(idx)}
                  className="text-xs text-[#D9483D] hover:bg-red-50 px-2 py-1 rounded-lg transition-colors flex items-center gap-1 font-bold"
                  title="حذف وسيلة التواصل"
                >
                  <Icon name="trash" size={13} strokeWidth={1.8} />
                  <span>حذف</span>
                </button>
              </div>

              {/* Controls */}
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Platform dropdown */}
                  <div>
                    <label className="block text-xs font-bold text-[#1C2126] mb-1.5">
                      المنصة / الشبكة
                    </label>
                    <div className="relative">
                      <select
                        value={link.platform}
                        onChange={(e) => updateLink(idx, "platform", e.target.value)}
                        className="w-full appearance-none rounded-xl border border-[#D3D7DC] bg-white py-3.5 px-3 pl-8 text-sm font-medium text-[#1C2126] outline-none focus:border-[#1F7A7B] focus:ring-2 focus:ring-[#1F7A7B]/20 transition-all shadow-2xs"
                      >
                        {PLATFORM_ORDER.map((p) => (
                          <option key={p} value={p}>
                            {PLATFORM_CONFIG[p].label}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5 text-[#1F7A7B]">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Custom Label (optional) */}
                  <InputField
                    label="تسمية مخصصة (اختياري)"
                    value={link.label ?? ""}
                    onChange={(v) => updateLink(idx, "label", v)}
                    placeholder="مثال: رقم الحجز، واتساب المساعد"
                  />
                </div>

                {/* Value input */}
                <InputField
                  label={`رابط أو بيانات ${cfg.label}`}
                  value={link.value}
                  onChange={(v) => updateLink(idx, "value", v)}
                  placeholder={cfg.placeholder}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Add button */}
      <button
        type="button"
        onClick={addLink}
        className="w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#CFE6E6] bg-[#EAF4F4]/50 py-3 px-4 text-xs font-bold text-[#1F7A7B] hover:bg-[#EAF4F4] hover:border-[#1F7A7B] transition-all cursor-pointer"
      >
        <Icon name="plus" size={14} strokeWidth={2} />
        <span>+ إضافة وسيلة تواصل أو حساب آخر</span>
      </button>

      {/* Note */}
      <InputField
        label="ملاحظة أو تعليمات التواصل"
        value={data.note}
        onChange={(v) => onChange({ ...data, note: v })}
        multiline
        placeholder="أوقات التواصل ومواعيد الرد المتاحة..."
      />
    </EditorCard>
  );
}
