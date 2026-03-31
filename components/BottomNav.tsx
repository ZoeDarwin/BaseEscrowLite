"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "Escrow" },
  { href: "/deals", label: "Deals" },
  { href: "/about", label: "About" }
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav" aria-label="Bottom Navigation">
      {items.map((item) => (
        <Link
          className={pathname === item.href ? "nav-link nav-link--active" : "nav-link"}
          href={item.href}
          key={item.href}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}