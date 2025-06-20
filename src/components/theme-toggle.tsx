
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
      <Button variant="ghost" size="icon" aria-label="Toggle theme" title="Toggle theme" className="rounded-full" disabled>
        <Sun className="h-[1.2rem] w-[1.2rem]" /> 
      </Button>
    )
  }

  let displayTheme = theme;
  if (theme === 'system' && typeof window !== 'undefined') {
    displayTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  const buttonTitle = displayTheme === "light" ? "Switch to dark mode" : "Switch to light mode";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={buttonTitle}
      title={buttonTitle} // Added dynamic title attribute
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

