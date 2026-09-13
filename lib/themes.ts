export type ThemeId = "academic-path" | "pulse" | "heritage" | "horizon";

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
}

export interface PlatformTheme {
  id: ThemeId;
  name: string;
  nameAr: string;
  bestFor: string;
  mood: string;
  fonts: {
    display: string;
    body: string;
  };
  radius: {
    card: string;       // Tailwind class like "rounded-lg"
    cardCss: string;    // CSS px value like "8px"
    button: string;     // Tailwind class like "rounded-xl"
    buttonCss: string;  // CSS px value like "12px"
    badge: string;      // Tailwind class like "rounded-full"
  };
  shadow: {
    card: string;
    button: string;
  };
  swatches: string[];
  light: ThemeColors;
}

export const PLATFORM_THEMES: Record<ThemeId, PlatformTheme> = {
  "academic-path": {
    id: "academic-path",
    name: "Academic Path",
    nameAr: "المسار الأكاديمي",
    bestFor: "الدورات الجامعية، الشهادات المهنية، التدريب المالي، واللغات",
    mood: "منظم، موثوق، ومؤسسي رسمي",
    fonts: {
      display: "'El Messiri', serif",
      body: "'IBM Plex Sans Arabic', sans-serif",
    },
    radius: {
      card: "rounded-md",
      cardCss: "6px",
      button: "rounded-md",
      buttonCss: "6px",
      badge: "rounded-sm",
    },
    shadow: {
      card: "0 2px 8px rgba(22, 35, 63, 0.06)",
      button: "0 2px 4px rgba(22, 35, 63, 0.1)",
    },
    swatches: ["#16233F", "#445069", "#C9A24B", "#F7F5EF"],
    light: {
      primary: "#16233F",
      secondary: "#445069",
      accent: "#C9A24B",
      background: "#F7F5EF",
      surface: "#FDFCF9",
      border: "#E2DFD5",
      textPrimary: "#1A1E27",
      textSecondary: "#5B6270",
    },
  },

  pulse: {
    id: "pulse",
    name: "Pulse",
    nameAr: "نبض",
    bestFor: "معسكرات البرمجة، العلوم والتكنولوجيا (STEM)، المهارات الرقمية، والشباب",
    mood: "ديناميكي، حديث، وحيوي جداً",
    fonts: {
      display: "'Cairo', sans-serif",
      body: "'Tajawal', sans-serif",
    },
    radius: {
      card: "rounded-2xl",
      cardCss: "14px",
      button: "rounded-xl",
      buttonCss: "12px",
      badge: "rounded-lg",
    },
    shadow: {
      card: "0 8px 24px rgba(43, 78, 255, 0.12)",
      button: "0 4px 14px rgba(43, 78, 255, 0.35)",
    },
    swatches: ["#2B4EFF", "#1B2A6B", "#FF6B4A", "#F2F4F8"],
    light: {
      primary: "#2B4EFF",
      secondary: "#1B2A6B",
      accent: "#FF6B4A",
      background: "#F2F4F8",
      surface: "#FFFFFF",
      border: "#DCE1EC",
      textPrimary: "#12172B",
      textSecondary: "#565F79",
    },
  },

  heritage: {
    id: "heritage",
    name: "Heritage",
    nameAr: "أصالة",
    bestFor: "اللغة العربية، علوم القرآن والجامعات الإسلامية، التاريخ، والأدب والثقافة",
    mood: "أصيل، وقور، مستوحى من المخطوطات والتراث",
    fonts: {
      display: "'Amiri', serif",
      body: "'Noto Kufi Arabic', sans-serif",
    },
    radius: {
      card: "rounded-sm",
      cardCss: "3px",
      button: "rounded-sm",
      buttonCss: "3px",
      badge: "rounded-none",
    },
    shadow: {
      card: "0 2px 6px rgba(27, 75, 67, 0.08)",
      button: "0 2px 4px rgba(176, 141, 87, 0.2)",
    },
    swatches: ["#1B4B43", "#6B7A4F", "#B08D57", "#F1E7D3"],
    light: {
      primary: "#1B4B43",
      secondary: "#6B7A4F",
      accent: "#B08D57",
      background: "#F1E7D3",
      surface: "#FBF6EC",
      border: "#E1D2B0",
      textPrimary: "#241C12",
      textSecondary: "#6B5D45",
    },
  },

  horizon: {
    id: "horizon",
    name: "Horizon",
    nameAr: "أفق",
    bestFor: "تطوير الأعمال، التنمية المهنية، دورات الكبار، والاستشارات",
    mood: "هادئ، بسيط، واثق، وعصري للغاية",
    fonts: {
      display: "'IBM Plex Sans Arabic', sans-serif",
      body: "'IBM Plex Sans Arabic', sans-serif",
    },
    radius: {
      card: "rounded-xl",
      cardCss: "8px",
      button: "rounded-lg",
      buttonCss: "8px",
      badge: "rounded-md",
    },
    shadow: {
      card: "0 1px 3px rgba(38, 50, 56, 0.08)",
      button: "0 2px 4px rgba(38, 50, 56, 0.12)",
    },
    swatches: ["#263238", "#4A6274", "#C1794A", "#F5F6F7"],
    light: {
      primary: "#263238",
      secondary: "#4A6274",
      accent: "#C1794A",
      background: "#F5F6F7",
      surface: "#FFFFFF",
      border: "#E3E6E9",
      textPrimary: "#1E2226",
      textSecondary: "#5C646B",
    },
  },
};

export const THEME_LIST = Object.values(PLATFORM_THEMES);
