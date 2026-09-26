"use client";

import { useState, useEffect, useMemo } from "react";
import { EGYPTIAN_STAGES, EGYPTIAN_GRADE_LEVELS, GradeLevel } from "@/lib/droos-data";

interface GradeLevelSelectorProps {
  selectedGradeId: string;
  onSelectGradeId: (gradeId: string) => void;
  teacherGrades?: string[]; // Array of grade names the teacher teaches (e.g. ['الصف الأول الثانوي'])
}

export default function GradeLevelSelector({
  selectedGradeId,
  onSelectGradeId,
  teacherGrades = [],
}: GradeLevelSelectorProps) {
  const [selectedStageId, setSelectedStageId] = useState<string>("");

  // Filter allowed grade levels based on what the teacher teaches
  const allowedGrades = useMemo(() => {
    if (!teacherGrades || teacherGrades.length === 0) {
      return EGYPTIAN_GRADE_LEVELS;
    }
    const filtered = EGYPTIAN_GRADE_LEVELS.filter(
      (g) => teacherGrades.includes(g.name_ar) || teacherGrades.includes(g.id)
    );
    return filtered.length > 0 ? filtered : EGYPTIAN_GRADE_LEVELS;
  }, [teacherGrades]);

  // Filter allowed stages: only stages that contain at least one of the teacher's allowed grades
  const allowedStages = useMemo(() => {
    return EGYPTIAN_STAGES.filter((stage) =>
      allowedGrades.some((g) => g.stage_id === stage.id)
    );
  }, [allowedGrades]);

  // Available grades for the currently selected stage
  const availableGrades = useMemo(() => {
    if (!selectedStageId) return [];
    return allowedGrades.filter((g) => g.stage_id === selectedStageId);
  }, [allowedGrades, selectedStageId]);

  // Prefill stage if grade is already selected (e.g. edit mode)
  useEffect(() => {
    if (selectedGradeId) {
      const foundGrade = EGYPTIAN_GRADE_LEVELS.find(
        (g) => g.id === selectedGradeId || g.name_ar === selectedGradeId
      );
      if (foundGrade) {
        setSelectedStageId(foundGrade.stage_id);
      }
    }
    // Do NOT auto-select a stage when there's no grade — user must choose explicitly
  }, [selectedGradeId]);

  // If stage changes and current selectedGradeId doesn't belong to it, clear selection
  useEffect(() => {
    if (selectedStageId && selectedGradeId) {
      const belongs = availableGrades.some(
        (g) => g.id === selectedGradeId || g.name_ar === selectedGradeId
      );
      if (!belongs) {
        onSelectGradeId(""); // Clear — don't auto-select first
      }
    }
  }, [selectedStageId, availableGrades, selectedGradeId, onSelectGradeId]);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      
      {/* Step 1: Educational Stage Dropdown */}
      <div>
        <label htmlFor="stageSelect" className="block text-xs font-bold text-[#1C2126] mb-1.5">
          1. اختر المرحلة الدراسية <span className="text-[#D9483D]">*</span>
        </label>
        <div className="relative">
          <select
            id="stageSelect"
            value={selectedStageId}
            onChange={(e) => {
              setSelectedStageId(e.target.value);
              onSelectGradeId(""); // Reset grade when stage changes
            }}
            required
            className={`w-full appearance-none rounded-2xl border py-3 px-4 pl-10 text-sm font-medium outline-none transition-all focus:border-[#1F7A7B] focus:bg-white focus:ring-2 focus:ring-[#1F7A7B]/20 ${
              selectedStageId
                ? "border-[#D3D7DC] bg-[#F7F8F9] text-[#1C2126]"
                : "border-[#E8A83C] bg-[#FDF3E3] text-[#9C6B18]"
            }`}
          >
            <option value="" disabled>
              — اختر المرحلة الدراسية —
            </option>
            {allowedStages.map((stage) => (
              <option key={stage.id} value={stage.id}>
                {stage.name_ar}
              </option>
            ))}
          </select>

          {/* Styled Expand/Collapse Arrow with proper padding */}
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#1F7A7B]">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Step 2: Grade Level Dropdown */}
      <div>
        <label htmlFor="gradeSelect" className="block text-xs font-bold text-[#1C2126] mb-1.5">
          2. اختر الصف الدراسي <span className="text-[#D9483D]">*</span>
        </label>
        <div className="relative">
          <select
            id="gradeSelect"
            value={selectedGradeId}
            onChange={(e) => onSelectGradeId(e.target.value)}
            required
            disabled={!selectedStageId}
            className={`w-full appearance-none rounded-2xl border py-3 px-4 pl-10 text-sm font-medium outline-none transition-all focus:border-[#1F7A7B] focus:bg-white focus:ring-2 focus:ring-[#1F7A7B]/20 ${
              !selectedStageId
                ? "border-[#D3D7DC] bg-[#EEF0F2] text-[#8A929B] cursor-not-allowed"
                : selectedGradeId
                ? "border-[#D3D7DC] bg-[#F7F8F9] text-[#1C2126]"
                : "border-[#E8A83C] bg-[#FDF3E3] text-[#9C6B18]"
            }`}
          >
            <option value="" disabled>
              {selectedStageId ? "— اختر الصف الدراسي —" : "— اختر المرحلة أولاً —"}
            </option>
            {availableGrades.map((grade) => (
              <option key={grade.id} value={grade.id}>
                {grade.name_ar}
              </option>
            ))}
          </select>

          {/* Styled Expand/Collapse Arrow with proper padding */}
          <div className={`pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 ${
            !selectedStageId ? "text-[#8A929B]/40" : "text-[#1F7A7B]"
          }`}>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

    </div>
  );
}
