
"use client"

import DoctorDashboard from "@/components/doctorDashboard/DoctorDashboard"
import PatientDashboard from "@/components/patientDashboard/PatientDashboard"
import { useAuth } from "@/hooks/useAuth"

export default function DashboardPage() {
  const {user} = useAuth()
  return (
    <>
      {user?.role.toLowerCase() == "doctor" && <DoctorDashboard />}
      {user?.role.toLowerCase() == "patient" && <PatientDashboard />}
    </>
  )
}
