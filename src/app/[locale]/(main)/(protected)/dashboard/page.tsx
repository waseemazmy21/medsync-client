
"use client"

import DoctorDashboard from "@/components/doctorDashboard/DoctorDashboard"
import PatientDashboard from "@/components/patientDashboard/PatientDashboard"
import { useAuth } from "@/hooks/useAuth"
import { useTranslations } from "next-intl"

export default function DashboardPage() {
  const {user} = useAuth()
  const t = useTranslations('dashboard');
  return (
    <div className="container max-w-7xl mx-auto p-4 space-y-8">
      {/* Example: <h1>{t('title')}</h1> */}
      {user?.role.toLowerCase() == "doctor" && <DoctorDashboard />}
      {user?.role.toLowerCase() == "patient" && <PatientDashboard />}
    </div>
  )
}
