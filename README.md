# 📚 Droos App (منصة دروس التعليمية)

A modern, full-stack educational management platform and interactive teacher dashboard designed for educators and students. Built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, and **Supabase** (Postgres + Auth + SSR).

---

## 🌟 Key Highlights & Architecture

- **Teacher Management Studio**: Unified interface for educators to organize educational stages (المراحل الدراسية), grade levels (الصفوف الدراسية), courses (الدورات والكورسات), chapters/units (الدروس / Modules), and interactive sessions (الحصص / Lessons).
- **Interactive Droos Table Manager**: Drag-and-drop hierarchy management, filter chips by grade/stage, batch actions, and realtime status tracking.
- **Dynamic Homepage & Theme Builder**: Customizable landing page sections for teachers and academies to showcase featured courses, statistics, testimonials, and FAQs.
- **Secure Multi-Role Authentication**: Role-based access control (RBAC) via Supabase Auth with Row Level Security (RLS) policies.
- **High-Performance Architecture**: Zero-bloat Next.js 16 App Router setup, React 19 Server Components, and Tailwind CSS v4 styling.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router), React 19 |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS v4, PostCSS |
| **Backend & DB** | Supabase (PostgreSQL, Row Level Security) |
| **Auth & Client** | `@supabase/ssr`, `@supabase/supabase-js` |
| **Icons & UI** | Lucide React, Heroicons, Custom SVG Components |

---

## 📂 Project Structure

```text
droos-app/
├── app/
│   ├── api/                   # Server API endpoints
│   ├── teacher/               # Teacher control panel & Droos table management
│   ├── teacher_login/         # Educator portal authentication
│   ├── layout.tsx             # Root application layout & font configurations
│   ├── page.tsx               # High-converting landing page
│   └── globals.css            # Global CSS with Tailwind v4 setup
├── components/
│   ├── landing/               # Hero, About, AudiencePaths, FeaturesGrid, FAQs, Footer
│   └── teacher/               # DroosTableManager, GradeLevelFilterChips, HomePageBuilder
├── lib/                       # Supabase client helpers (browser/server/middleware)
├── supabase/
│   └── migrations/            # Database schemas, RLS policies, seed scripts
└── feature-md-files/          # Architectural documentation & agent guidelines
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/sayedyounis00/droos-app.git
cd droos-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Database Setup

Apply the migrations located in `supabase/migrations/` to your Supabase project:
- `20260908_droos_table.sql`: Tables for `educational_stages`, `grade_levels`, `courses`, `modules`, and `lessons`.
- `20260908_teachers.sql`: Profiles, permissions, and teacher metadata.

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 📖 Database Schema Hierarchy

```text
Educational Stage (المرحلة الدراسية)
  └── Grade Level (الصف الدراسي)
        └── Course (الكورس / الدورة)
              └── Module / Chapter (الدرس)
                    └── Lesson / Session (الحصة)
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues tab or submit a pull request.

---

## 📄 License

This project is licensed under the MIT License.
