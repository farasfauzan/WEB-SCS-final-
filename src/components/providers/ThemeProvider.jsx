"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children, ...props }) {
  // Fungsi: Membungkus seluruh aplikasi agar state tema (dark/light) bisa mengalir dan diakses oleh komponen mana pun di Next.js.
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
