import React from "react";

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
}

const inputStyles =
  "w-full rounded-2xl border border-[#D3D7DC] bg-white py-3.5 px-4 text-sm font-medium text-[#1C2126] outline-none transition-all focus:border-[#1F7A7B] focus:ring-2 focus:ring-[#1F7A7B]/20 shadow-2xs resize-none placeholder:text-[#8A929B]";

export function InputField({
  label,
  value,
  onChange,
  placeholder,
  multiline = false,
}: InputFieldProps) {
  return (
    <div>
      <label className="block text-xs font-bold text-[#1C2126] mb-2">{label}</label>
      {multiline ? (
        <textarea
          rows={4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={inputStyles}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={inputStyles}
        />
      )}
    </div>
  );
}
