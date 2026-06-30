"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/products", label: "Products", exact: false },
  { href: "/admin/categories", label: "Categories", exact: false },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <aside className="w-52 shrink-0 border-r border-gray-200 bg-white">
      <div className="px-4 py-6">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-4">
          Admin
        </p>
        <nav className="flex flex-col gap-0.5">
          {links.map((link) => {
            const active = link.exact
              ? pathname === link.href
              : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  active
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
