import { User, Doctor } from '@/lib/types';
import Link from 'next/link'
import React from 'react'

const navigationItems = [
  { label: "Dashboard", value: "dashboard" },
  { label: "Departments", value: "departments", notView: "Doctor" },
  { label: "Appointments", value: "appointments" },
  // { label: "Report", value: "report", notView: "Patient" },
]

type NavProps = {
  atherClasses: string;
  user: User | Doctor | null
}

function Navigation({ atherClasses, user }: NavProps) {
  const showReports = user && user.role === 'Doctor' && (user as Doctor).departmentManager;
  console.log("User in Navigation:", user);
  return (
    <nav className={`${atherClasses} flex text-gray-700 dark:text-gray-300`}>
      {
        navigationItems.map(
          item => item.notView !== user?.role &&
            <Link key={item.label} href={item.value} className="hover:text-blue-500">{item.label}</Link>
        )
      }
      {showReports && <Link href={'/reports'} className="hover:text-blue-500">Reports</Link>}
    </nav>
  )
}

export default Navigation
