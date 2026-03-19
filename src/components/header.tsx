import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

const navigation = [
  { name: "Trang chủ", href: "/" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
      <nav
        className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Điều hướng chính"
      >
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50"
        >
          {siteConfig.name}
        </Link>
        <ul className="flex items-center gap-1">
          {navigation.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
