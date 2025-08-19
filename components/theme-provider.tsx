"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

export function UnThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useTheme();

  React.useEffect(() => {
    // Force light theme when in home layout
    if (theme !== "light") {
      setTheme("light");
    }

  }, []);

  return <>{children}</>;
}
