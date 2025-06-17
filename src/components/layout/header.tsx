import Link from "next/link";
import { Church } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Church className="h-6 w-6 text-primary" />
          <span className="font-headline text-xl font-bold text-foreground">
            HSCM Connect
          </span>
        </Link>
        <nav className="flex items-center space-x-4">
          <Button variant="link" asChild>
            <Link href="/decision" className="font-headline">I've Raised My Hand</Link>
          </Button>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
