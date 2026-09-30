import React, { useState, useEffect } from 'react';
import { TeacherUser } from '@/lib/auth/teacher-auth';
import { EGYPTIAN_GRADE_LEVELS } from '@/lib/droos-data';
import { FormInput } from '@/components/ui/FormInput';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Spinner } from '@/components/ui/Spinner';
import { ProfileSidebar } from './ProfileSidebar';

interface AccountTabProps {
  teacher: TeacherUser | null;
  onTeacherUpdated: (updated: TeacherUser) => void;
}

export function AccountTab({ teacher, onTeacherUpdated }: AccountTabProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Form Fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [subject, setSubject] = useState('');
  const [grades, setGrades] = useState<string[]>([]);
  const [governorate, setGovernorate] = useState('');
  const [bio, setBio] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [subdomainLocked, setSubdomainLocked] = useState(false);

  useEffect(() => {
    if (teacher) {
      setName(teacher.name || '');
      setPhone(teacher.phone || '');
      setSubject(teacher.subject || '');
      const safeGrades = Array.isArray(teacher.grades)
        ? teacher.grades
        : typeof teacher.grades === 'string' && teacher.grades
        ? [teacher.grades]
        : [];
      setGrades(safeGrades);
      setGovernorate(teacher.governorate || '');
      setBio(teacher.bio || '');
      setSubdomain(teacher.subdomain || '');
      setSubdomainLocked(Boolean(teacher.subdomainLocked));
    }
  }, [teacher]);

  const handleSaveAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setToastMessage('');
    setErrorMessage('');

    try {
      const res = await fetch('/api/teacher/update-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: teacher?.id,
          name,
          phone,
          password,
          subject,
          grades,
          governorate,
          bio,
          subdomain,
          currentSubdomain: teacher?.subdomain,
          subdomainLocked,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || 'حدث خطأ أثناء حفظ البيانات في قاعدة البيانات.');
        return;
      }

      const updated = data.teacher as TeacherUser;
      onTeacherUpdated(updated);
      setSubdomain(updated.subdomain || '');
      setSubdomainLocked(Boolean(updated.subdomainLocked));

      setToastMessage(data.message || 'تم حفظ جميع بيانات الحساب بنجاح في قاعدة البيانات');
      setTimeout(() => setToastMessage(''), 4000);
    } catch {
      setErrorMessage('حدث خطأ في الاتصال بالخادم عند تحديث البيانات.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      {/* Comprehensive Account Form Card */}
      <div className="lg:col-span-2 rounded-3xl border border-[#EEF0F2] bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#EEF0F2] pb-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-[#1C2126]">بيانات الحساب الشاملة</h2>
            <p className="text-xs text-[#8A929B] mt-1">إدارة وتحكم كافة بيانات المعلم والنطاق الفرعي</p>
          </div>
          <span className="rounded-full bg-[#EAF4F4] px-3 py-1 text-xs font-bold text-[#1F7A7B]">
            تحديث مباشر في قاعدة البيانات
          </span>
        </div>

        <form onSubmit={handleSaveAccount} className="space-y-6">
          {/* 1. Subdomain Section */}
          <div className="rounded-2xl border border-[#CFE6E6] bg-[#EAF4F4]/50 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="subdomain" className="block text-xs font-bold text-[#0F4E4F]">
                النطاق الفرعي الخاص بك (Subdomain)
              </label>
              {subdomainLocked ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#D9483D]/10 px-2.5 py-0.5 text-[11px] font-bold text-[#D9483D]">
                  🔒 تم قفل الرابط (تعديل لمرة واحدة فقط)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#E8A83C]/20 px-2.5 py-0.5 text-[11px] font-bold text-[#9C6B18]">
                  ✏️ متاح للتعديل لمرة واحدة فقط
                </span>
              )}
            </div>

            <div className="relative flex items-center dir-ltr">
              <span className="absolute left-4 text-xs font-bold text-[#1F7A7B] select-none">
                .droos.app
              </span>
              <input
                id="subdomain"
                type="text"
                value={subdomain}
                onChange={(e) => setSubdomain(e.target.value)}
                disabled={subdomainLocked}
                placeholder="e.g. ahmedsaad"
                className={`w-full rounded-xl border py-3.5 pl-24 pr-4 text-sm font-bold outline-none transition-all ${
                  subdomainLocked
                    ? 'border-[#D3D7DC] bg-[#EEF0F2] text-[#8A929B] cursor-not-allowed'
                    : 'border-[#7EB8B9] bg-white text-[#0F4E4F] focus:border-[#1F7A7B] focus:ring-2 focus:ring-[#1F7A7B]/20'
                }`}
              />
            </div>

            {subdomainLocked ? (
              <p className="text-[11px] font-medium text-[#4A5158] dir-rtl">
                ⚠️ **الرابط مقفول:** لقد قمت بتعيين رابطك الفرعي مسبقاً. لتقديم طلب تغيير الرابط يرجى التواصل مع الدعم الفني عبر واتساب.
              </p>
            ) : (
              <p className="text-[11px] font-medium text-[#C88A22] dir-rtl">
                💡 **تنبيه هام:** يمكنك تغيير وتخصيص رابطك الفرعي **لمرة واحدة فقط**. بمجرد الضغط على &quot;حفظ التعديلات&quot; سيتفعل الرابط ويتم قفله تلقائياً.
              </p>
            )}

            {subdomain && (
              <div className="pt-2 border-t border-[#CFE6E6]/60 flex items-center justify-between text-xs dir-rtl">
                <span className="text-[#0F4E4F] font-bold">معاينة الرابط الخاص بك:</span>
                <a
                  href={`https://${subdomain}.droos.app`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#1F7A7B] underline hover:text-[#166465] dir-ltr"
                >
                  https://{subdomain}.droos.app
                </a>
              </div>
            )}
          </div>

          {/* 2. Personal & Profile Info Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <FormInput
              label="اسم المعلم الثلاثي"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="أحمد سعد علي"
            />

            <FormInput
              label="رقم الهاتف (مصر)"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="01143825523"
            />

            <PasswordInput
              label="كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />

            <FormInput
              label="المادة التخصصية"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              placeholder="الرياضيات / الفيزياء"
            />

            {/* Educational Stages / Grades */}
            <div>
              <label className="block text-xs font-bold text-[#1C2126] mb-2">المراحل التعليمية</label>
              <div className="flex flex-col gap-2 rounded-2xl border border-[#D3D7DC] bg-[#F7F8F9] p-4 text-sm font-medium text-[#1C2126]">
                {EGYPTIAN_GRADE_LEVELS.map((grade) => (
                  <label key={grade.id} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={grades.includes(grade.name_ar)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setGrades([...grades, grade.name_ar]);
                        } else {
                          setGrades(grades.filter((g) => g !== grade.name_ar));
                        }
                      }}
                      className="h-4 w-4 rounded border-[#D3D7DC] text-[#1F7A7B] focus:ring-[#1F7A7B]"
                    />
                    <span>{grade.name_ar}</span>
                  </label>
                ))}
              </div>
            </div>

            <FormInput
              label="المحافظة"
              type="text"
              value={governorate}
              onChange={(e) => setGovernorate(e.target.value)}
              placeholder="القاهرة / الجيزة"
            />
          </div>

          {/* Bio Description */}
          <div>
            <label className="block text-xs font-bold text-[#1C2126] mb-2">
              نبذة عن المعلم والخبرة التدريسية
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="اكتب نبذة مختصرة تظهر للطلاب في صفحتك الشخصية..."
              className="w-full rounded-2xl border border-[#D3D7DC] bg-[#F7F8F9] py-3 px-4 text-sm font-medium text-[#1C2126] outline-none transition-all focus:border-[#1F7A7B] focus:bg-white focus:ring-2 focus:ring-[#1F7A7B]/20"
            />
          </div>

          {/* Save Button & Status Messages */}
          <div className="flex flex-col gap-3 pt-4 border-t border-[#EEF0F2] sm:flex-row sm:items-center sm:justify-between">
            <span className="text-xs font-medium text-[#8A929B]">
              سيتم تحديث البيانات مباشرة في قاعدة البيانات.
            </span>
            <div className="flex flex-wrap items-center gap-3">
              {toastMessage && (
                <div
                  role="status"
                  className="flex max-w-xs items-center gap-2 rounded-xl bg-[#2E9E5B] px-3 py-2 text-xs font-bold text-white shadow-md shadow-[#2E9E5B]/20"
                >
                  <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{toastMessage}</span>
                </div>
              )}
              {errorMessage && (
                <div
                  role="alert"
                  className="flex max-w-xs items-center gap-2 rounded-xl bg-[#D9483D]/10 px-3 py-2 text-xs font-bold text-[#D9483D]"
                >
                  <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{errorMessage}</span>
                </div>
              )}
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 rounded-2xl bg-[#1F7A7B] py-3.5 px-7 text-sm font-bold text-white shadow-lg shadow-[#1F7A7B]/20 transition-all hover:bg-[#166465] active:scale-[0.98] disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Spinner size="sm" className="text-white" />
                    <span>جاري التحديث...</span>
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>حفظ التعديلات في قاعدة البيانات</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Overview Sidebar */}
      <ProfileSidebar
        teacher={teacher}
        name={name}
        phone={phone}
        subject={subject}
        grades={grades}
        governorate={governorate}
        subdomain={subdomain}
        subdomainLocked={subdomainLocked}
      />
    </div>
  );
}
