import Link from 'next/link'
import React from 'react'
import { useTranslations } from 'next-intl';

const navigationItems = [
    { labelKey: "dashboard", value: "dashboard" },
    { labelKey: "departments", value: "departments" },
    { labelKey: "appointments", value: "appointments" },
]

type NavProps = {
    atherClasses: string
}

function Navigation({atherClasses}: NavProps) {
    const t = useTranslations('navigation');
    
  return (
    <nav className={`${atherClasses} flex text-gray-700 dark:text-gray-300`}>
        {navigationItems.map(item => (
          <Link key={item.labelKey} href={item.value} className="hover:text-blue-500">
            {t(item.labelKey)}
          </Link>
        ))}
    </nav>
  )
}

export default Navigation
