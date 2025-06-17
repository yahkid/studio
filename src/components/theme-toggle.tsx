
"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"

import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme() // theme can be 'light', 'dark', or 'system'
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    let currentDisplayTheme = theme;
    if (theme === 'system' && typeof window !== 'undefined') {
      currentDisplayTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    // Always toggle between explicit light and dark
    setTheme(currentDisplayTheme === "light" ? "dark" : "light");
  }

  if (!mounted) {
    // Render a static version that matches the server's default rendering (theme="system").
    // For "system", `theme === "light"` is false, so Sun icon and "Switch to light mode" is rendered.
    // Adding `disabled` helps prevent interaction before full hydration if needed,
    // though matching the output is the primary goal for avoiding hydration errors.
    return (
      <Button variant="ghost" size="icon" aria-label="Switch to light mode" disabled>
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      </Button>
    )
  }

  // Determine the currently displayed theme after mounting.
  let displayTheme = theme;
  if (theme === 'system' && typeof window !== 'undefined') {
    displayTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={displayTheme === "light" ? "Switch to dark mode" : "Switch to light mode"}
    >
      {displayTheme === "light" ? (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      )}
    </Button>
  )
}
