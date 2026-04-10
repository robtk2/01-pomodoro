/**
 * Design Tokens - Typography
 * Define las fuentes, tamaños y espaciados de texto de la aplicación.
 */
export const Typography = {
  fontFamily: {
    light: "Outfit_300Light",
    regular: "Outfit_400Regular",
    medium: "Outfit_500Medium",
    semibold: "Outfit_600SemiBold",
    bold: "Outfit_700Bold",
    mono: "monospace",
  },
  fontSize: {
    tiny: 11,
    small: 14,
    body: 16,
    header: 22,
    title: 32,
    display: 72,
  },
  fontWeight: {
    light: "300" as any,
    regular: "400" as any,
    medium: "500" as any,
    semibold: "600" as any,
    bold: "700" as any,
  },
  letterSpacing: {
    tighter: -0.5,
    normal: 0,
    wider: 1,
    display: -2,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    loose: 1.8,
  }
} as const;
