import Link from 'next/link'
import React from 'react'

const navigationItems = [
    { label: "Dashboard", value: "dashboard" },
    { label: "Departments", value: "departments", notView: "Doctor" },
    { label: "Appointments", value: "appointments" },
]

type NavProps = {
    atherClasses: string;
    userRole: string
}

function Navigation({atherClasses, userRole}: NavProps) {
    
  return (
    <nav className={`${atherClasses} flex text-gray-700 dark:text-gray-300`}>
        {navigationItems.map(item => item.notView !== userRole && <Link key={item.label} href={item.value} className="hover:text-blue-500">{item.label}</Link>)}
    </nav>
  )
}

export default Navigation
