"use client";


import { useRouter, usePathname } from "next/navigation";
import { routing } from "@/i18n/routing";
import { useMemo } from "react";

export default function LocaleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locales = routing.locales;
  const currentLocale = useMemo(() => {
    // Extract locale from pathname (e.g. /en/page)
    const firstSegment = pathname?.split("/")[1] as typeof routing.locales[number];
    return locales.includes(firstSegment) ? firstSegment : routing.defaultLocale;
  }, [pathname, locales]);

  const handleLocaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;
    // Always redirect to /[locale] + rest of path
    const segments = pathname?.split("/") || [];
    // Remove empty first segment if exists
    if (segments[0] === "") segments.shift();
    // If first segment is a locale, replace it
    if (locales.includes(segments[0] as typeof routing.locales[number])) {
      segments[0] = newLocale;
    } else {
      segments.unshift(newLocale);
    }
    const newPath = "/" + segments.join("/");
    router.push(newPath);
  };

  return (
    <select
      value={currentLocale}
      onChange={handleLocaleChange}
      className="px-2 py-1 rounded border bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
    >
      {locales.map((locale) => (
        <option key={locale} value={locale}>
          {locale.toUpperCase()}
        </option>
      ))}
    </select>
  );
}
