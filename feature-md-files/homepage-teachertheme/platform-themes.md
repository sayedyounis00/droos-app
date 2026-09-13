# Ta3leem Platform Themes — 5 Selectable Visual Identities

**Purpose:** During platform setup, a teacher picks one of these 5 themes as their platform's visual identity (like choosing a Shopify theme). Each theme is a full, self-contained design system — not a palette swap of the same layout. They differ in color, typography, corner radius, shadow style, and spacing rhythm, so two platforms on different themes should feel like different products.

Store the choice in `platforms.theme_id` (text: `academic-path` | `pulse` | `garden` | `heritage` | `horizon`). Everything a theme needs (colors, fonts, shape tokens) should live in one config object so the teacher dashboard's theme-picker, the live preview, and the published platform all read from the same source — never hardcode theme values in more than one place.

---

## Theme 1 — المسار الأكاديمي (Academic Path)

**Best for:** university-style courses, professional certifications, business/finance training, formal language institutes.
**Mood:** structured, credible, institutional — the platform equivalent of a well-printed syllabus.

| Token | Light | Dark |
|---|---|---|
| Primary | `#16233F` (deep navy) | `#3A5A8C` |
| Secondary | `#445069` (slate blue-grey) | `#6B7893` |
| Accent | `#C9A24B` (antique gold) | `#D9B968` |
| Background | `#F7F5EF` | `#0D1420` |
| Surface | `#FDFCF9` | `#16233F` |
| Border | `#E2DFD5` | `#2A3650` |
| Text primary | `#1A1E27` | `#EDEAE0` |
| Text secondary | `#5B6270` | `#A8AFC0` |
| Success / Warning / Error / Info | `#3F7D58` / `#C9A24B` / `#B3432B` / `#3A6EA5` | lighten each ~15% |

**Typography:** Display/headings — `El Messiri` (semi-serif Arabic, formal weight). Body — `IBM Plex Sans Arabic`. Two families, clearly distinct roles; don't mix a third.

**Shape & spacing:** Small radius (4–6px), 1px hairline borders as the primary separator (not shadows), formal symmetrical grid, generous but structured margins. Shadows only on modals/overlays, kept subtle (`rgba(22,35,63,0.08)`).

---

## Theme 2 — نبض (Pulse)

**Best for:** coding bootcamps, STEM, data/digital-skills courses, youth and young-adult audiences.
**Mood:** energetic, current, dashboard-like.

| Token | Light | Dark (recommended default for this theme) |
|---|---|---|
| Primary | `#2B4EFF` (cobalt) | `#4C74FF` |
| Secondary | `#1B2A6B` (deep indigo) | `#2E3E8C` |
| Accent | `#FF6B4A` (fiery coral) | `#FF8A6C` |
| Background | `#F2F4F8` | `#0B0E1A` |
| Surface | `#FFFFFF` | `#141A2E` |
| Border | `#DCE1EC` | `#28304A` |
| Text primary | `#12172B` | `#E7E9F3` |
| Text secondary | `#565F79` | `#9CA3C0` |
| Success / Warning / Error / Info | `#16A34A` / `#F5A623` / `#E5484D` / `#2B4EFF` | lighten each ~15% |

**Typography:** Display — `Cairo` (bold, geometric). Body — `Tajawal`. Headlines can run bold and tight; this theme can carry more visual weight than the others.

**Shape & spacing:** Larger radius (10–12px), bold color-tinted shadows under primary buttons/cards (e.g. `rgba(43,78,255,0.25)`), denser dashboard-style grid, diagonal or angular accent shapes rather than soft blobs. Since the audience skews toward dark-UI preference, ship this theme dark-first with light as the toggle option (the other four ship light-first).

---

## Theme 3 — روضة (The Garden)

**Best for:** children's courses, early-childhood education, kids' hobby/creative classes, children's Quran memorization.
**Mood:** playful, warm, high-trust-for-parents.

| Token | Light | Dark ("evening" variant — optional, kids UIs rarely need it) |
|---|---|---|
| Primary | `#2EC4B6` (turquoise/mint) | `#4FD9C7` |
| Secondary | `#FFC857` (sunny yellow) | `#FFD87A` |
| Accent | `#FF6F91` (coral pink) | `#FF8FA8` |
| Background | `#FFF8EF` | `#16211F` |
| Surface | `#FFFFFF` | `#1E2E2C` |
| Border | `#F2E4CE` | `#2E3E3B` |
| Text primary | `#2B2117` | `#F5EFE3` |
| Text secondary | `#7A6F60` | `#B8AF9E` |
| Success / Warning / Error / Info | `#3CB878` / `#FFC857` / `#F76C6C` / `#4FA8D8` | lighten each ~15% |

**Typography:** Display — `Baloo Bhaijaan 2` (rounded, friendly Arabic display face). Body — `Almarai` (rounded, high legibility for young readers and their parents).

**Shape & spacing:** Very rounded (16–24px, pill-shaped buttons), soft drop shadows, organic/blob decorative shapes rather than geometric ones, illustrated (not line) icon style, large touch targets and airy spacing — this audience includes parents tapping on phones, not just kids.

---

## Theme 4 — أصالة (Heritage)

**Best for:** Arabic language courses, Quran/Islamic studies, literature, history, humanities, cultural-heritage content.
**Mood:** dignified, warm, rooted — a manuscript feel rather than a corporate one.

| Token | Light | Dark |
|---|---|---|
| Primary | `#1B4B43` (deep emerald) | `#2E7C6C` |
| Secondary | `#6B7A4F` (muted olive) | `#8A9968` |
| Accent | `#B08D57` (antique brass) | `#C9A567` |
| Background | `#F1E7D3` (warm parchment) | `#10201B` |
| Surface | `#FBF6EC` | `#17302A` |
| Border | `#E1D2B0` | `#2E4A40` |
| Text primary | `#241C12` | `#EDE3CC` |
| Text secondary | `#6B5D45` | `#B8AC90` |
| Success / Warning / Error / Info | `#4C7A4A` / `#C08A2E` / `#A8452F` / `#3E6E82` | lighten each ~15% |

**Typography:** Display — `Amiri` (classical naskh-style serif; use at larger sizes only — it loses clarity below ~20px). Body — `Noto Kufi Arabic` or `Tajawal` for actual reading comfort.

**Shape & spacing:** Minimal rounding (2–4px), thin gold hairline borders, subtle geometric Islamic-pattern motifs used sparingly as section dividers or card corner details (never as full backgrounds — keep text contrast clean), symmetrical/centered layouts that echo manuscript pages, generous margins.

---

## Theme 5 — أفق (Horizon)

**Best for:** business/professional development, corporate training, adult continuing education, freelance/consulting courses — also the safest **default** for a teacher who doesn't want to think about branding yet.
**Mood:** calm, minimal, confident. Deliberately restrained.

| Token | Light | Dark |
|---|---|---|
| Primary | `#263238` (charcoal slate) | `#3E4A52` |
| Secondary | `#4A6274` (steel blue) | `#6C8496` |
| Accent | `#C1794A` (muted copper) | `#D89468` |
| Background | `#F5F6F7` | `#14171A` |
| Surface | `#FFFFFF` | `#1D2124` |
| Border | `#E3E6E9` | `#2C3134` |
| Text primary | `#1E2226` | `#EDEFF1` |
| Text secondary | `#5C646B` | `#A3ABB2` |
| Success / Warning / Error / Info | `#2E9E6D` / `#D6A24C` / `#D0524B` / `#4E7FB0` | lighten each ~15% |

**Typography:** One family only — `IBM Plex Sans Arabic` — using weight (Regular / SemiBold / Bold) to carry all hierarchy. No second display face.

**Shape & spacing:** Subtle rounding (6–8px), flat design — no shadows, hierarchy comes from whitespace and 1px borders only. The most spacious of the five themes; content blocks stay narrow (under ~75 Arabic characters per line) for reading comfort.

---

## Implementation notes for the agent

**1. Token delivery — CSS variables, not five Tailwind builds.**
Define each theme's tokens as CSS custom properties scoped by a `data-theme` attribute on `<html>`, combined with a `.dark` class for the dark variant:

```css
[data-theme="academic-path"] {
  --color-primary: #16233F;
  --color-accent: #C9A24B;
  --color-bg: #F7F5EF;
  /* ...etc */
}
[data-theme="academic-path"].dark {
  --color-primary: #3A5A8C;
  --color-bg: #0D1420;
  /* ...etc */
}
```

Repeat for all five `data-theme` values. In `tailwind.config`, point utilities at the variables so `bg-primary` / `text-primary` etc. automatically resolve to whichever theme is active — no per-theme Tailwind config needed:

```js
colors: {
  primary: 'var(--color-primary)',
  secondary: 'var(--color-secondary)',
  accent: 'var(--color-accent)',
  background: 'var(--color-bg)',
  surface: 'var(--color-surface)',
  border: 'var(--color-border)',
}
```

**2. Single source of truth.** Keep all five themes' tokens in one typed config (e.g. `lib/themes.ts`) exporting name (Arabic + English), token values, font pairing, and radius/shadow tokens. The teacher dashboard's theme-picker cards, the live preview, and the CSS variable injection should all read from this one object — never duplicate values.

**3. Database.** Add `theme_id text default 'horizon'` to `platforms`. This is a schema change — per the project's existing guardrails, confirm with the user before running the migration.

**4. Font loading — load only what's needed.** Each theme uses 1–2 font families. Load fonts per-platform based on `theme_id` when rendering that platform's public pages (via `next/font/google`, only importing the active theme's families), rather than shipping all five themes' fonts to every visitor.

**5. Light Theme Only.** The platform operates strictly in light theme across all platform themes.

**6. Theme picker UI.** In the branding step of platform setup, show all 5 as cards: theme name, a 3–4 color swatch strip, the one-line "best for" description, and a "select" action. Selecting one should update the live platform preview immediately via the `data-theme` attribute — no page reload needed.
