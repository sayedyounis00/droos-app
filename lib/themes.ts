export type ThemeId = "academic-path" | "pulse" | "garden" | "heritage" | "horizon";

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
  isDarkDefault?: boolean;
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
  dark: ThemeColors;
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
    dark: {
      primary: "#3A5A8C",
      secondary: "#6B7893",
      accent: "#D9B968",
      background: "#0D1420",
      surface: "#16233F",
      border: "#2A3650",
      textPrimary: "#EDEAE0",
      textSecondary: "#A8AFC0",
    },
  },

  pulse: {
    id: "pulse",
    name: "Pulse",
    nameAr: "نبض",
    bestFor: "معسكرات البرمجة، العلوم والتكنولوجيا (STEM)، المهارات الرقمية، والشباب",
    mood: "ديناميكي، حديث، وحيوي جداً",
    isDarkDefault: true,
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
    dark: {
      primary: "#4C74FF",
      secondary: "#2E3E8C",
      accent: "#FF8A6C",
      background: "#0B0E1A",
      surface: "#141A2E",
      border: "#28304A",
      textPrimary: "#E7E9F3",
      textSecondary: "#9CA3C0",
    },
  },

  garden: {
    id: "garden",
    name: "The Garden",
    nameAr: "روضة",
    bestFor: "دورات الأطفال، التعليم المبكر، مهارات الرسم والإبداع، وتحفيظ القرآن للأطفال",
    mood: "مرح، دافئ، ومريح لأولياء الأمور",
    fonts: {
      display: "'Baloo Bhaijaan 2', cursive",
      body: "'Almarai', sans-serif",
    },
    radius: {
      card: "rounded-3xl",
      cardCss: "24px",
      button: "rounded-full",
      buttonCss: "9999px",
      badge: "rounded-full",
    },
    shadow: {
      card: "0 10px 30px rgba(46, 196, 182, 0.15)",
      button: "0 4px 12px rgba(255, 111, 145, 0.3)",
    },
    swatches: ["#2EC4B6", "#FFC857", "#FF6F91", "#FFF8EF"],
    light: {
      primary: "#2EC4B6",
      secondary: "#FFC857",
      accent: "#FF6F91",
      background: "#FFF8EF",
      surface: "#FFFFFF",
      border: "#F2E4CE",
      textPrimary: "#2B2117",
      textSecondary: "#7A6F60",
    },
    dark: {
      primary: "#4FD9C7",
      secondary: "#FFD87A",
      accent: "#FF8FA8",
      background: "#16211F",
      surface: "#1E2E2C",
      border: "#2E3E3B",
      textPrimary: "#F5EFE3",
      textSecondary: "#B8AF9E",
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
    dark: {
      primary: "#2E7C6C",
      secondary: "#8A9968",
      accent: "#C9A567",
      background: "#10201B",
      surface: "#17302A",
      border: "#2E4A40",
      textPrimary: "#EDE3CC",
      textSecondary: "#B8AC90",
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
    dark: {
      primary: "#3E4A52",
      secondary: "#6C8496",
      accent: "#D89468",
      background: "#14171A",
      surface: "#1D2124",
      border: "#2C3134",
      textPrimary: "#EDEFF1",
      textSecondary: "#A3ABB2",
    },
  },
};

export const THEME_LIST = Object.values(PLATFORM_THEMES);
