import React from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function FormInput({
  label,
  id,
  error,
  helperText,
  className = '',
  ...props
}: FormInputProps) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-xs font-bold text-[#1C2126] mb-2">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full rounded-2xl border border-[#D3D7DC] bg-[#F7F8F9] py-3.5 px-4 text-sm font-medium text-[#1C2126] outline-none transition-all focus:border-[#1F7A7B] focus:bg-white focus:ring-2 focus:ring-[#1F7A7B]/20 ${
          error ? 'border-[#D9483D] focus:border-[#D9483D] focus:ring-[#D9483D]/20' : ''
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-[#D9483D] font-medium">{error}</p>}
      {!error && helperText && (
        <p className="mt-1.5 text-xs text-[#8A929B]">{helperText}</p>
      )}
    </div>
  );
}
