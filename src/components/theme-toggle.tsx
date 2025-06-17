
"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"

import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme() 
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    let currentDisplayTheme = theme;
    if (theme === 'system' && typeof window !== 'undefined') {
      currentDisplayTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    setTheme(currentDisplayTheme === "light" ? "dark" : "light");
  }

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" aria-label="Toggle theme" className="rounded-full" disabled>
        {/* Render a placeholder or a default icon that matches server render for "system" */}
        {/* System theme often defaults to light, so Moon might be shown initially if server can't know preference */}
        <Sun className="h-[1.2rem] w-[1.2rem]" /> 
      </Button>
    )
  }

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
      className="rounded-full hover:bg-accent transition-colors"
    >
      {displayTheme === "light" ? (
        <Moon className="h-[1.2rem] w-[1.2rem] text-primary" />
      ) : (
        <Sun className="h-[1.2rem] w-[1.2rem] text-secondary" />
      )}
    </Button>
  )
}
