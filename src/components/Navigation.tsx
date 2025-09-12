import { User, Doctor } from '@/lib/types';
import Link from 'next/link'
import React from 'react'
import { useTranslation } from 'react-i18next';

const navigationItems = [
  { labelKey: "navigation.dashboard", value: "dashboard" },
  { labelKey: "navigation.departments", value: "departments", notView: "Doctor" },
  { labelKey: "navigation.appointments", value: "appointments" },
  // { labelKey: "navigation.reports", value: "reports", notView: "Patient" },
]

type NavProps = {
  atherClasses: string;
  user: User | Doctor | null
}

function Navigation({ atherClasses, user }: NavProps) {
  const { t } = useTranslation();
  const showReports = user && user.role === 'Doctor' && (user as Doctor).departmentManager;
  console.log("User in Navigation:", user);
  return (
    <nav className={`${atherClasses} flex text-gray-700 dark:text-gray-300`}>
      {
        navigationItems.map(
          item => item.notView !== user?.role &&
            <Link key={item.labelKey} href={item.value} className="hover:text-blue-500">{t(item.labelKey)}</Link>
        )
      }
      {showReports && <Link href={'/reports'} className="hover:text-blue-500">{t('navigation.reports')}</Link>}
    </nav>
  )
}

export default Navigation
