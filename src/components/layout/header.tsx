import Link from "next/link";
import { User } from "lucide-react"; // Replaced Church and ThemeToggle related imports

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#e0e0e0] bg-white">
      <div className="container flex items-center justify-between py-6">
        <Link href="/" className="flex items-center">
          <span className="font-body font-bold text-2xl text-primary-green">
            HSCM Connect
          </span>
        </Link>
        <nav className="flex items-center space-x-4">
          <Link
            href="/decision"
            className="font-body font-bold py-2 px-4 border border-primary-green text-primary-green rounded-md transition-all duration-300 ease-in-out hover:bg-secondary-green-light hover:text-primary-green"
          >
            I've Raised My Hand
          </Link>
          <User className="h-6 w-6 text-primary-green" />
        </nav>
      </div>
    </header>
  );
}
