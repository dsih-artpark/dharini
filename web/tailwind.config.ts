import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        /* ---- Legacy Palette (kept for backward compatibility) ---- */
        blue: {
          10: "#F3F5FB",
          20: "#CDD6EF",
          30: "#5D7FDD",
          40: "#3A11B6",
          50: "#1E3A88",
          60: "#172C66",
        },
        grey: {
          0: "#FFFFFF",
          10: "#F8F9FA",
          20: "#E6E8EB",
          30: "#DFE3E6",
          40: "#D7DBDF",
          50: "#B7BDC2",
          60: "#889096",
          70: "#687076",
          80: "#11181C",
          90: "#0C150A",
        },
        red: {
          10: "#FBE9E7",
          20: "#E1A8A5",
          30: "#A1221B",
        },
        yellow: {
          10: "#FEF3E1",
          20: "#FDD591",
          30: "#9B6323",
        },
        green: {
          10: "#E9F4E8",
          20: "#A9D4A3",
          30: "#107C10",
        },
        purple: {
          10: "#E7D2F7",
          20: "#CAA4E6",
          30: "#8C47BF",
        },
        orange: {
          10: "#FFE3CB",
          20: "#F6C398",
          30: "#E69653",
        },
        teal: {
          10: "#E4F2F2",
          20: "#AEE0E1",
          30: "#6D9A9B",
        },
        olive: {
          10: "#DFF5CC",
          20: "#B6E88C",
          30: "#84A26B",
        },
        coral: {
          10: "#F9C8C3",
          20: "#F58E82",
          30: "#E55848",
        },
        sand: {
          0: "#F9F8F3",
          10: "#E0DCC5",
          20: "#C2BDA0",
          30: "#B3A972",
        },

        /* ---- Design System: Semantic Colors ---- */
        primary: {
          50: "var(--color-primary-50)",
          100: "var(--color-primary-100)",
          300: "var(--color-primary-300)",
          500: "var(--color-primary-500)",
          700: "var(--color-primary-700)",
          900: "var(--color-primary-900)",
        },
        neutral: {
          0: "var(--color-neutral-0)",
          50: "var(--color-neutral-50)",
          100: "var(--color-neutral-100)",
          150: "var(--color-neutral-150)",
          200: "var(--color-neutral-200)",
          300: "var(--color-neutral-300)",
          400: "var(--color-neutral-400)",
          500: "var(--color-neutral-500)",
          700: "var(--color-neutral-700)",
          900: "var(--color-neutral-900)",
        },
        success: {
          50: "var(--color-success-50)",
          200: "var(--color-success-200)",
          600: "var(--color-success-600)",
        },
        warning: {
          50: "var(--color-warning-50)",
          200: "var(--color-warning-200)",
          600: "var(--color-warning-600)",
        },
        danger: {
          50: "var(--color-danger-50)",
          200: "var(--color-danger-200)",
          600: "var(--color-danger-600)",
        },
        info: {
          50: "var(--color-info-50)",
          200: "var(--color-info-200)",
          600: "var(--color-info-600)",
        },
        surface: {
          DEFAULT: "var(--color-bg-surface)",
          subtle: "var(--color-bg-subtle)",
          muted: "var(--color-bg-muted)",
        },
        text: {
          primary: "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
          muted: "var(--color-text-muted)",
          inverse: "var(--color-text-inverse)",
          disabled: "var(--color-text-disabled)",
        },
        border: {
          DEFAULT: "var(--color-border)",
          strong: "var(--color-border-strong)",
          focus: "var(--color-border-focus)",
        },
      },

      /* ---- Font Families ---- */
      fontFamily: {
        sans: ["Geist", "sans-serif"],
        serif: ["Noto Serif", "serif"],
        mono: ["Geist", "monospace"],
      },

      /* ---- Font Sizes ---- */
      fontSize: {
        xs: ["var(--font-size-xs)", { lineHeight: "1rem" }],
        sm: ["var(--font-size-sm)", { lineHeight: "1.25rem" }],
        base: ["var(--font-size-base)", { lineHeight: "1.5rem" }],
        lg: ["var(--font-size-lg)", { lineHeight: "1.75rem" }],
        xl: ["var(--font-size-xl)", { lineHeight: "1.75rem" }],
        "2xl": ["var(--font-size-2xl)", { lineHeight: "2rem" }],
        "3xl": ["var(--font-size-3xl)", { lineHeight: "2.25rem" }],
        "4xl": ["var(--font-size-4xl)", { lineHeight: "2.5rem" }],
        "5xl": ["var(--font-size-5xl)", { lineHeight: "1" }],
        "6xl": ["var(--font-size-6xl)", { lineHeight: "1" }],
      },

      /* ---- Font Weights ---- */
      fontWeight: {
        normal: "var(--font-weight-normal)",
        medium: "var(--font-weight-medium)",
        semibold: "var(--font-weight-semibold)",
        bold: "var(--font-weight-bold)",
      },

      /* ---- Border Radius ---- */
      borderRadius: {
        none: "var(--radius-none)",
        sm: "var(--radius-sm)",
        DEFAULT: "var(--radius-lg)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
        "3xl": "var(--radius-3xl)",
        full: "var(--radius-full)",
      },

      /* ---- Box Shadows ---- */
      boxShadow: {
        sm: "var(--shadow-sm)",
        DEFAULT: "var(--shadow-md)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
        "2xl": "var(--shadow-2xl)",
        card: "var(--shadow-card)",
        dropdown: "var(--shadow-dropdown)",
      },

      /* ---- Transition Duration & Timing ---- */
      transitionDuration: {
        fast: "150ms",
        DEFAULT: "200ms",
        slow: "300ms",
      },
      transitionTimingFunction: {
        DEFAULT: "ease",
        spring: "var(--transition-spring)",
      },

      /* ---- Z-Index ---- */
      zIndex: {
        dropdown: "var(--z-dropdown)",
        sticky: "var(--z-sticky)",
        "modal-backdrop": "var(--z-modal-backdrop)",
        modal: "var(--z-modal)",
        popover: "var(--z-popover)",
        toast: "var(--z-toast)",
        tooltip: "var(--z-tooltip)",
      },
    },
  },
  plugins: [],
} satisfies Config;