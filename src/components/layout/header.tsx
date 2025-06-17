import Link from "next/link";
import { User, Sparkles } from "lucide-react"; // Added Sparkles for logo icon
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background dark:bg-neutral-dark dark:border-neutral-medium">
      <div className="container flex items-center justify-between py-6">
        <Link href="/" className="flex items-center space-x-2">
          <Sparkles className="h-7 w-7 text-primary" /> 
          <span className="font-headline font-bold text-2xl text-primary">
            HOLY SPIRIT CONNECT
          </span>
        </Link>
        <nav className="flex items-center space-x-4">
          <Link
            href="/decision"
            className="font-body font-semibold py-2 px-4 border border-primary text-primary rounded-md transition-all duration-300 ease-in-out hover:bg-primary hover:text-primary-foreground dark:border-primary dark:text-primary dark:hover:bg-primary/80 dark:hover:text-primary-foreground"
          >
            I've Raised My Hand
          </Link>
          {/* <User className="h-6 w-6 text-primary" /> User icon commented out for now, can be re-added if login is implemented */}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}