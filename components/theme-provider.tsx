"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

/**
 * ThemeProvider Component
 *
 * This component is used to wrap the application with the ThemeProvider.
 * It provides the theme context to the application.
 *
 * @param {React.ReactNode} children - The children to be wrapped by the ThemeProvider.
 * @param {ThemeProviderProps} props - The props for the ThemeProvider.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
