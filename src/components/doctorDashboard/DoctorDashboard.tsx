"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Users, FileText, Plus, ArrowRight, Stethoscope, TrendingUp, Activity } from "lucide-react"
import Link from "next/link"
import HeadSection from "../HeadSection"
import { Appointment } from "@/lib/types"
import { useAppointments } from "@/hooks/useAppointments"
import { useAuth } from "@/hooks/useAuth"
import { useMemo } from "react"
import { appointments } from "@/services/appointmentServices"
import { useQuery } from "@tanstack/react-query"

export default function DoctorDashboard() {
    console.log("DoctorDashboard Components");
    

  const {user} = useAuth()
//   const { Appointments, pastAppointments, upcomingAppointments, todayAppointments, appointmentsLoading} = useAppointments()
    const {
    data: Appointments= [],
    isLoading: appointmentsLoading,
    error: appointmentsError,
  } = useQuery({
    queryKey: ["appointments"],
    queryFn: async () => {
      const {data} = await appointments()
      console.log("Response DashboardPage",data.appointments);
      
      return data.appointments || []
    },
     
      staleTime: 0.25 * 60 * 1000, // 2 دقائق
      refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    
  })

     const today = new Date().getDate();
  // past appointments
  console.log("today",new Date().getFullYear());
  
  const pastAppointments = useMemo(()=>{
    return Appointments.filter((app: Appointment) => new Date(app.date).getDate() < today)
  },[Appointments])

  const upcomingAppointments = useMemo(()=>{
    return Appointments.filter((app: Appointment) => new Date(app.date).getDate() > today)
  },[Appointments])

  const todayAppointments = useMemo(()=>{
    return Appointments.filter((app: Appointment) => new Date(app.date).getDate() == today)
  },[Appointments])

  console.log("pastAppointments",pastAppointments);
  console.log("upcomingAppointments",upcomingAppointments);
  console.log("todayAppointments",todayAppointments);
  
  const mockShifts = [
    {
      day: [0, 1, 2, 3, 4], // Saturday to Wednesday
      startTime: "09:00",
      endTime: "17:00",
    },
    {
      day: [5], // Thursday
      startTime: "10:00",
      endTime: "14:00",
    },
  ]

  const mockStats = {
    totalAppointments: 24,
    upcomingAppointments: 8,
    totalPatients: 156,
    recentFollowUps: 3,
    completedToday: 5,
    weeklyAppointments: 32,
    monthlyAppointments: 127,
    averageRating: 4.8,
    prescriptionsGiven: 18,
    followUpRate: 85,
  }

  const mockUpcomingAppointments = [
    {
      id: "1",
      date: "2024-01-15T10:00:00Z",
      patient: "Sarah Johnson",
      doctor: user?.name || "Dr. Smith",
      department: "Cardiology",
      status: "upcoming",
      notes: "Regular checkup for heart condition",
    },
    {
      id: "2",
      date: "2024-01-15T14:30:00Z",
      patient: "Michael Chen",
      doctor: user?.name || "Dr. Smith",
      department: "Cardiology",
      status: "upcoming",
      notes: "Follow-up after surgery",
    },
    {
      id: "3",
      date: "2024-01-16T09:00:00Z",
      patient: "Emily Davis",
      doctor: user?.name || "Dr. Smith",
      department: "Cardiology",
      status: "upcoming",
    },
  ]

  const mockRecentFollowUps = [
    {
      id: "4",
      date: "2024-01-20T10:00:00Z",
      patient: "Ahmed Hassan",
      doctor: user?.name || "Dr. Smith",
      department: "Cardiology",
      status: "upcoming",
      followUpDate: "2024-01-20T10:00:00Z",
    },
    {
      id: "5",
      date: "2024-01-22T14:00:00Z",
      patient: "Fatima Al-Zahra",
      doctor: user?.name || "Dr. Smith",
      department: "Cardiology",
      status: "upcoming",
      followUpDate: "2024-01-22T14:00:00Z",
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

  const getDayName = (dayIndex: number) => {
    const days = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    return days[dayIndex]
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const formatShiftDays = (days: number[]) => {
    if (days.length === 0) return "No days"
    if (days.length === 7) return "Every day"

    const dayNames = days.map(getDayName)
    if (days.length <= 3) {
      return dayNames.join(", ")
    }
    return `${dayNames.slice(0, 2).join(", ")} +${days.length - 2} more`
  }

  return (
    <>
      {/* Welcome Section */}
      <HeadSection>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome, Dr. {user?.name?.split(" ")[0] || "Doctor"}!</h1>
            <p className="text-blue-100">
              You have {todayAppointments.length} appointments today. Manage your patients and track their
              progress.
            </p>
          </div>
          <div className="hidden md:block">
            <Stethoscope className="h-16 w-16 text-blue-200" />
          </div>
        </div>
      </HeadSection>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{Appointments.length}</p>
                <p className="text-sm text-gray-600">Total Appointments</p>
                <p className="text-xs text-green-600 mt-1">+{mockStats.weeklyAppointments} this week</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{todayAppointments.length}</p>
                <p className="text-sm text-gray-600">Upcoming Today</p>
                <p className="text-xs text-blue-600 mt-1">{mockStats.completedToday} completed today</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <FileText className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{mockStats.recentFollowUps}</p>
                <p className="text-sm text-gray-600">Follow-ups Due</p>
                <p className="text-xs text-orange-600 mt-1">{mockStats.prescriptionsGiven} prescriptions given</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              Work Shifts
            </CardTitle>
            <CardDescription>Your fixed working hours</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockShifts.map((shift, index) => (
              <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="font-semibold text-gray-900">
                      {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
                    </span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    Shift {index + 1}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 font-medium">Working Days:</p>
                  <div className="flex flex-wrap gap-1">
                    {shift.day.map((dayIndex) => (
                      <Badge key={dayIndex} variant="outline" className="text-xs px-2 py-1">
                        {getDayName(dayIndex)}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full mt-3 bg-transparent">
              <Plus className="h-4 w-4 mr-2" />
              Manage Shifts
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Monthly Performance
            </CardTitle>
            <CardDescription>Your practice statistics this month</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Appointments</span>
              <span className="font-semibold">{mockStats.monthlyAppointments}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Average Rating</span>
              <div className="flex items-center gap-1">
                <span className="font-semibold">{mockStats.averageRating}</span>
                <span className="text-yellow-500">★</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Follow-up Rate</span>
              <span className="font-semibold text-green-600">{mockStats.followUpRate}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Prescriptions Given</span>
              <span className="font-semibold">{mockStats.prescriptionsGiven}</span>
            </div>
          </CardContent>
        </Card>

        {/* Today's Appointments */}
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Today's Schedule
              </CardTitle>
              <CardDescription>Your appointments for today</CardDescription>
            </div>
            <Link href="/doctor/appointments">
              <Button variant="outline" size="sm">
                View All
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockUpcomingAppointments.slice(0, 3).map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary rounded-lg">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{appointment.patient}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-500">{formatDate(appointment.date)}</span>
                    </div>
                  </div>
                </div>
                <Badge className="bg-blue-100 text-blue-800 text-xs">{appointment.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Follow-ups */}
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-orange-600" />
                Follow-ups Due
              </CardTitle>
              <CardDescription>Patients requiring follow-up</CardDescription>
            </div>
            <Link href="/doctor/appointments">
              <Button variant="outline" size="sm">
                View All
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockRecentFollowUps.map((appointment) => (
              <div key={appointment.id} className="p-3 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Users className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{appointment.patient}</p>
                      <p className="text-xs text-gray-600">{appointment.department}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Clock className="h-3 w-3 text-orange-400" />
                  <span className="text-xs text-orange-700">Due: {formatDate(appointment.followUpDate!)}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks for managing your practice</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              <Link href="/doctor/appointments/new">
                <Button className="w-full justify-start gap-3 h-auto p-4 bg-transparent" variant="outline">
                  <Plus className="h-5 w-5" />
                  <div className="text-left">
                    <p className="font-medium">New Appointment</p>
                    <p className="text-xs text-gray-500">Schedule patient visit</p>
                  </div>
                </Button>
              </Link>
              <Link href="/doctor/appointments">
                <Button className="w-full justify-start gap-3 h-auto p-4 bg-transparent" variant="outline">
                  <Calendar className="h-5 w-5" />
                  <div className="text-left">
                    <p className="font-medium">All Appointments</p>
                    <p className="text-xs text-gray-500">View schedule</p>
                  </div>
                </Button>
              </Link>
              <Link href="/doctor/appointments">
                <Button className="w-full justify-start gap-3 h-auto p-4 bg-transparent" variant="outline">
                  <FileText className="h-5 w-5" />
                  <div className="text-left">
                    <p className="font-medium">Medical Records</p>
                    <p className="text-xs text-gray-500">Patient history</p>
                  </div>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

