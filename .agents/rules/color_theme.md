---
trigger: always_on
---

# Color Theme — Teacher/Student Learning Platform

**Stack context:** Next.js + Supabase, Arabic (RTL), teacher (Google login) / student (manual login) platform.

## Design Direction

Education platforms need to feel **trustworthy, calm, and focused** — not flashy like an e-commerce store. Since this is a learning *platform* (not a store), the palette leans toward a professional deep blue/teal as primary (associated with focus, trust, knowledge), with a warm amber/gold accent for calls-to-action (enrolling, submitting, joining a class), and clean neutrals that keep long Arabic text comfortable to read.

Deep blue-teal also works well culturally for Arabic/MENA-region edtech — it avoids being tied to a specific country flag or brand, and reads as modern and professional in both RTL and LTR contexts.

---

## Primary Palette

| Token | Hex | Usage |
|---|---|---|
| `primary-50` | `#EAF4F4` | Subtle backgrounds, hover states |
| `primary-100` | `#CFE6E6` | Light badges, selected states |
| `primary-300` | `#7EB8B9` | Borders, secondary icons |
| `primary-500` | `#1F7A7B` | **Main brand color** — buttons, links, nav |
| `primary-600` | `#166465` | Hover/active states on primary |
| `primary-700` | `#0F4E4F` | Text on light backgrounds, headers |
| `primary-900` | `#0A3536` | Dark mode surfaces, deep accents |

## Accent (Call-to-Action)

| Token | Hex | Usage |
|---|---|---|
| `accent-50` | `#FDF3E3` | Highlight backgrounds |
| `accent-300` | `#F3C97C` | Hover accents |
| `accent-500` | `#E8A83C` | **CTA buttons** — "Join Class", "Submit", "Enroll" |
| `accent-600` | `#C88A22` | CTA hover |
| `accent-700` | `#9C6B18` | Text on light accent backgrounds |

## Neutrals (Text & Backgrounds)

| Token | Hex | Usage |
|---|---|---|
| `neutral-0` | `#FFFFFF` | Base background (light mode) |
| `neutral-50` | `#F7F8F9` | Page background |
| `neutral-100` | `#EEF0F2` | Card backgrounds, dividers |
| `neutral-300` | `#D3D7DC` | Borders, disabled states |
| `neutral-500` | `#8A929B` | Placeholder text, muted labels |
| `neutral-700` | `#4A5158` | Secondary body text |
| `neutral-900` | `#1C2126` | Primary body text (Arabic text — high contrast for readability) |

## Semantic Colors

| Token | Hex | Usage |
|---|---|---|
| `success-500` | `#2E9E5B` | Correct answers, completed lessons, approved requests |
| `warning-500` | `#E0A429` | Pending review, incomplete profile |
| `error-500` | `#D9483D` | Failed submission, validation errors |
| `info-500` | `#3A8DDE` | Announcements, tips, notifications |

---

## Dark Mode

| Token | Hex | Usage |
|---|---|---|
| `dark-bg` | `#12171B` | Page background |
| `dark-surface` | `#1B2227` | Cards, panels |
| `dark-border` | `#2C353C` | Dividers |
| `dark-text-primary` | `#EDEFF1` | Main text |
| `dark-text-secondary` | `#A7AEB5` | Muted text |
| `dark-primary` | `#3FA3A4` | Brighter teal for contrast on dark bg |
| `dark-accent` | `#F0BB63` | Brighter gold for contrast on dark bg |

---

## Role-Based Accent (Optional)

To help users instantly recognize which dashboard they're in:

| Role | Accent Color | Hex |
|---|---|---|
| Teacher | Teal (primary) | `#1F7A7B` |
| Student | Soft Blue | `#3A8DDE` |

Use this only as a thin top-bar stripe or badge color — keep the rest of the UI on the shared palette for consistency.

---

## RTL & Arabic Typography Notes

- Ensure sufficient contrast on body text: use `neutral-900` on `neutral-0`/`neutral-50`, never lighter than `neutral-700` for paragraph text — Arabic script needs slightly higher contrast than Latin text at the same size to stay readable.
- Avoid pure black (`#000000`) — it causes harsh contrast with Arabic script's dense letterforms. `neutral-900 (#1C2126)` is softer.
- Test all colors with your chosen Arabic web font (e.g., Cairo, Tajawal, IBM Plex Sans Arabic) — some accent colors read differently against Arabic glyph density than Latin text.
- Set `dir="rtl"` at the root and mirror directional icons (arrows, chevrons) — color tokens themselves don't need mirroring, only layout/iconography.

---

## Tailwind CSS Config Snippet

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EAF4F4',
          100: '#CFE6E6',
          300: '#7EB8B9',
          500: '#1F7A7B',
          600: '#166465',
          700: '#0F4E4F',
          900: '#0A3536',
        },
        accent: {
          50: '#FDF3E3',
          300: '#F3C97C',
          500: '#E8A83C',
          600: '#C88A22',
          700: '#9C6B18',
        },
        neutral: {
          0: '#FFFFFF',
          50: '#F7F8F9',
          100: '#EEF0F2',
          300: '#D3D7DC',
          500: '#8A929B',
          700: '#4A5158',
          900: '#1C2126',
        },
        success: { 500: '#2E9E5B' },
        warning: { 500: '#E0A429' },
        error:   { 500: '#D9483D' },
        info:    { 500: '#3A8DDE' },
      },
    },
  },
};
```

## CSS Variables (for globals.css / dark mode toggling)

```css
:root {
  --color-primary: #1F7A7B;
  --color-accent: #E8A83C;
  --color-bg: #F7F8F9;
  --color-surface: #FFFFFF;
  --color-text-primary: #1C2126;
  --color-text-secondary: #4A5158;
  --color-border: #D3D7DC;
}

[data-theme="dark"] {
  --color-primary: #3FA3A4;
  --color-accent: #F0BB63;
  --color-bg: #12171B;
  --color-surface: #1B2227;
  --color-text-primary: #EDEFF1;
  --color-text-secondary: #A7AEB5;
  --color-border: #2C353C;
}
```