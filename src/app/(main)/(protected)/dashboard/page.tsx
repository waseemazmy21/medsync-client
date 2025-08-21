
"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, Clock, User, Building2, Plus, ArrowRight, Activity, FileText } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import { appointments } from "@/services/appointmentsServices"

export default function DashboardPage() {
  const {user} = useAuth()

  // Fetch upcoming appointments
  const {
    data: upcomingAppointments,
    isLoading: upcomingLoading,
    error: upcomingError,
  } = useQuery({
    // queryKey: ["appointments", "upcoming"],
    queryKey: ["appointments"],
    queryFn: async () => {
      const {data} = await appointments()
      console.log("Response DashboardPage",data);
      
      return data.appointments || []
    },
  })

  // const pastLoading = true

  // Fetch past appointments
  const {
    data: pastAppointments,
    isLoading: pastLoading,
    error: pastError,
  } = useQuery({
    queryKey: ["appointments", "past"],
    queryFn: async () => {
      const {data} = await appointments()
      console.log("Response DashboardPage",data);
      return data.appointments || []
    },
  })

  // Mock data for development
  const mockUpcoming = [
    {
      id: "1",
      date: "2024-01-15T10:00:00Z",
      patient: "patient1",
      doctor: "Dr. Sarah Johnson",
      department: "Cardiology",
      status: "upcoming",
      notes: "Regular checkup",
    },
    {
      id: "2",
      date: "2024-01-20T14:30:00Z",
      patient: "patient1",
      doctor: "Dr. Michael Chen",
      department: "Dermatology",
      status: "upcoming",
    },
  ]

  const mockPast = [
    {
      id: "3",
      date: "2024-01-05T09:00:00Z",
      patient: "patient1",
      doctor: "Dr. Emily Davis",
      department: "General Medicine",
      status: "completed",
      prescription: {
        medicine: "Amoxicillin 500mg",
        dose: "Take 1 tablet twice daily for 7 days",
      },
    },
  ]

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

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

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name?.split(" ")[0]}!</h1>
            <p className="text-blue-100">
              Manage your appointments, view your medical history, and stay connected with your healthcare providers.
            </p>
          </div>
          <div className="hidden md:block">
            <Activity className="h-16 w-16 text-blue-200" />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{mockUpcoming.length}</p>
                <p className="text-sm text-gray-600">Upcoming Appointments</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{mockPast.length}</p>
                <p className="text-sm text-gray-600">Past Appointments</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-teal-100 rounded-lg">
                <Building2 className="h-6 w-6 text-teal-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">5</p>
                <p className="text-sm text-gray-600">Available Departments</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Appointments */}
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Upcoming Appointments
              </CardTitle>
              <CardDescription>Your scheduled appointments</CardDescription>
            </div>
            <Link href="/dashboard/appointments">
              <Button variant="outline" size="sm">
                View All
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingLoading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-4 w-[160px]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : mockUpcoming.length > 0 ? (
              mockUpcoming.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary rounded-lg">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{appointment.doctor}</p>
                      <p className="text-sm text-gray-600">{appointment.department}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{formatDate(appointment.date)}</span>
                      </div>
                    </div>
                  </div>
                  <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No upcoming appointments</p>
                <Link href="/dashboard/departments">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Book Appointment
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Past Appointments */}
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-600" />
                Recent History
              </CardTitle>
              <CardDescription>Your past appointments and prescriptions</CardDescription>
            </div>
            <Link href="/dashboard/appointments">
              <Button variant="outline" size="sm">
                View All
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {pastLoading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-4 w-[160px]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : mockPast.length > 0 ? (
              mockPast.map((appointment) => (
                <div key={appointment.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <User className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{appointment.doctor}</p>
                        <p className="text-sm text-gray-600">{appointment.department}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{formatDate(appointment.date)}</span>
                        </div>
                      </div>
                    </div>
                    <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                  </div>
                  {appointment.prescription && (
                    <div className="mt-3 p-3 bg-white rounded border-l-4 border-green-500">
                      <p className="text-sm font-medium text-gray-900">Prescription:</p>
                      <p className="text-sm text-gray-700">{appointment.prescription.medicine}</p>
                      <p className="text-xs text-gray-500 mt-1">{appointment.prescription.dose}</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No past appointments</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks you might want to perform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/dashboard/departments">
              <Button className="w-full justify-start gap-3 h-auto p-4 bg-transparent" variant="outline">
                <Plus className="h-5 w-5" />
                <div className="text-left">
                  <p className="font-medium">Book Appointment</p>
                  <p className="text-xs text-gray-500">Schedule with a doctor</p>
                </div>
              </Button>
            </Link>
            <Link href="/dashboard/profile">
              <Button className="w-full justify-start gap-3 h-auto p-4 bg-transparent" variant="outline">
                <User className="h-5 w-5" />
                <div className="text-left">
                  <p className="font-medium">Update Profile</p>
                  <p className="text-xs text-gray-500">Manage your information</p>
                </div>
              </Button>
            </Link>
            <Link href="/dashboard/appointments">
              <Button className="w-full justify-start gap-3 h-auto p-4 bg-transparent" variant="outline">
                <Calendar className="h-5 w-5" />
                <div className="text-left">
                  <p className="font-medium">View Appointments</p>
                  <p className="text-xs text-gray-500">See all appointments</p>
                </div>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
