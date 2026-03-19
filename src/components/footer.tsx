import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

const footerLinks = [
  {
    title: "Khám phá",
    links: [
      { name: "Xem Tử Vi", href: "/" },
      { name: "Lá Số Tử Vi", href: "/" },
    ],
  },
];

export function Footer() {
  return (
    <footer
      className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950"
      role="contentinfo"
    >
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
          <div>
            <Link
              href="/"
              className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50"
            >
              {siteConfig.name}
            </Link>
            <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              {siteConfig.description}
            </p>
          </div>
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                {section.title}
              </h3>
              <ul className="mt-3 space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 border-t border-zinc-200 pt-6 dark:border-zinc-800">
          <p className="text-center text-xs text-zinc-500 dark:text-zinc-500">
            &copy; {new Date().getFullYear()} {siteConfig.name}. Bảo lưu mọi
            quyền.
          </p>
        </div>
      </div>
    </footer>
  );
}
