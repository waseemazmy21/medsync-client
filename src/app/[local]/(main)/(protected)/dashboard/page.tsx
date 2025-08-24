
"use client"

import DoctorDashboard from "@/components/doctorDashboard/DoctorDashboard"
import PatientDashboard from "@/components/patientDashboard/PatientDashboard"
import { useAuth } from "@/hooks/useAuth"



const getStatusColor = (status: string) => {
  switch (status) {
    case "upcoming":
      return "bg-blue-100 text-blue-800"
    case "completed":
      return "bg-green-100 text-green-800"
    case "cancelled":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const formatDate = (dateString: Date) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function DashboardPage() {
  const {user} = useAuth()
  return (
    <div className="container max-w-7xl mx-auto p-4 space-y-8">
      {user?.role.toLowerCase() == "doctor" && <DoctorDashboard />}
      {user?.role.toLowerCase() == "patient" && <PatientDashboard />}
    </div>
  )
}
