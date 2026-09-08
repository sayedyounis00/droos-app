"use client";

import { EGYPTIAN_STAGES, EGYPTIAN_GRADE_LEVELS } from "@/lib/droos-data";

interface GradeLevelFilterChipsProps {
  selectedGradeId: string; // 'all' or specific grade_level.id
  onSelectGrade: (gradeId: string) => void;
}

export default function GradeLevelFilterChips({
  selectedGradeId,
  onSelectGrade,
}: GradeLevelFilterChipsProps) {
  return (
    <div className="w-full space-y-3">
      {/* Label header */}
      <div className="flex items-center justify-between text-xs font-bold text-[#4A5158]">
        <span className="flex items-center gap-1.5">
          <svg className="h-4 w-4 text-[#1F7A7B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          تصفية الكورسات حسب الصف الدراسي:
        </span>
        {selectedGradeId !== "all" && (
          <button
            onClick={() => onSelectGrade("all")}
            className="text-[11px] font-bold text-[#1F7A7B] hover:underline"
          >
            إعادة ضبط الفلتر (عرض الكل)
          </button>
        )}
      </div>

      {/* Chips scroll container */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none dir-rtl">
        
        {/* Leading "الكل" Chip */}
        <button
          onClick={() => onSelectGrade("all")}
          className={`flex items-center gap-1.5 rounded-2xl py-2 px-4 text-xs font-bold transition-all whitespace-nowrap border shrink-0 ${
            selectedGradeId === "all"
              ? "bg-[#1F7A7B] text-white border-[#1F7A7B] shadow-md shadow-[#1F7A7B]/20"
              : "bg-white text-[#4A5158] border-[#EEF0F2] hover:border-[#1F7A7B]/40 hover:bg-[#F7F8F9]"
          }`}
        >
          <span>✨ الكل</span>
        </button>

        {/* Grouped by Stage */}
        {EGYPTIAN_STAGES.map((stage) => {
          const stageGrades = EGYPTIAN_GRADE_LEVELS.filter(
            (g) => g.stage_id === stage.id
          );

          return (
            <div key={stage.id} className="flex items-center gap-2 shrink-0">
              {/* Divider / Stage Label badge */}
              <div className="flex items-center gap-1 text-[10px] font-bold text-[#8A929B] bg-[#EEF0F2] px-2.5 py-1 rounded-xl">
                <span>{stage.name_ar}</span>
              </div>

              {/* Stage Grade Level Chips */}
              {stageGrades.map((grade) => {
                const isSelected = selectedGradeId === grade.id;

                return (
                  <button
                    key={grade.id}
                    onClick={() => onSelectGrade(grade.id)}
                    className={`flex items-center gap-1.5 rounded-2xl py-2 px-3.5 text-xs font-bold transition-all whitespace-nowrap border ${
                      isSelected
                        ? "bg-[#1F7A7B] text-white border-[#1F7A7B] shadow-md shadow-[#1F7A7B]/20"
                        : "bg-white text-[#1C2126] border-[#D3D7DC] hover:border-[#1F7A7B] hover:bg-[#EAF4F4]"
                    }`}
                  >
                    {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-[#E8A83C]" />}
                    <span>{grade.name_ar}</span>
                  </button>
                );
              })}
            </div>
          );
        })}

      </div>
    </div>
  );
}
