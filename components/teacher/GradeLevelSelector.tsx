"use client";

import { useState, useEffect } from "react";
import { EGYPTIAN_STAGES, EGYPTIAN_GRADE_LEVELS, GradeLevel } from "@/lib/droos-data";

interface GradeLevelSelectorProps {
  selectedGradeId: string;
  onSelectGradeId: (gradeId: string) => void;
}

export default function GradeLevelSelector({
  selectedGradeId,
  onSelectGradeId,
}: GradeLevelSelectorProps) {
  const [selectedStageId, setSelectedStageId] = useState<string>("");
  const [availableGrades, setAvailableGrades] = useState<GradeLevel[]>([]);

  // Prefill stage if grade is selected
  useEffect(() => {
    if (selectedGradeId) {
      const foundGrade = EGYPTIAN_GRADE_LEVELS.find((g) => g.id === selectedGradeId);
      if (foundGrade) {
        setSelectedStageId(foundGrade.stage_id);
      }
    } else if (!selectedStageId && EGYPTIAN_STAGES.length > 0) {
      setSelectedStageId(EGYPTIAN_STAGES[0].id);
    }
  }, [selectedGradeId]);

  // Update available grades when stage changes
  useEffect(() => {
    if (selectedStageId) {
      const filtered = EGYPTIAN_GRADE_LEVELS.filter((g) => g.stage_id === selectedStageId);
      setAvailableGrades(filtered);

      // If currently selected grade does not belong to new stage, reset selection to first grade of new stage
      if (filtered.length > 0) {
        const belongs = filtered.some((g) => g.id === selectedGradeId);
        if (!belongs) {
          onSelectGradeId(filtered[0].id);
        }
      }
    }
  }, [selectedStageId]);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      
      {/* Step 1: Educational Stage Dropdown */}
      <div>
        <label htmlFor="stageSelect" className="block text-xs font-bold text-[#1C2126] mb-1.5">
          1. اختر المرحلة الدراسية <span className="text-[#D9483D]">*</span>
        </label>
        <select
          id="stageSelect"
          value={selectedStageId}
          onChange={(e) => setSelectedStageId(e.target.value)}
          required
          className="w-full rounded-2xl border border-[#D3D7DC] bg-[#F7F8F9] py-3 px-4 text-sm font-medium text-[#1C2126] outline-none transition-all focus:border-[#1F7A7B] focus:bg-white focus:ring-2 focus:ring-[#1F7A7B]/20"
        >
          {EGYPTIAN_STAGES.map((stage) => (
            <option key={stage.id} value={stage.id}>
              {stage.name_ar}
            </option>
          ))}
        </select>
      </div>

      {/* Step 2: Grade Level Dropdown */}
      <div>
        <label htmlFor="gradeSelect" className="block text-xs font-bold text-[#1C2126] mb-1.5">
          2. اختر الصف الدراسي <span className="text-[#D9483D]">*</span>
        </label>
        <select
          id="gradeSelect"
          value={selectedGradeId}
          onChange={(e) => onSelectGradeId(e.target.value)}
          required
          className="w-full rounded-2xl border border-[#D3D7DC] bg-[#F7F8F9] py-3 px-4 text-sm font-medium text-[#1C2126] outline-none transition-all focus:border-[#1F7A7B] focus:bg-white focus:ring-2 focus:ring-[#1F7A7B]/20"
        >
          {availableGrades.map((grade) => (
            <option key={grade.id} value={grade.id}>
              {grade.name_ar}
            </option>
          ))}
        </select>
      </div>

    </div>
  );
}
