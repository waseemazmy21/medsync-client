"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Users, ArrowRight, Stethoscope, User } from "lucide-react"
import Link from "next/link"
import HeadSection from "../HeadSection"
import { Appointment, Doctor } from "@/lib/types"
import { useAppointments } from "@/hooks/useAppointments"
import { useAuth } from "@/hooks/useAuth"
import { formatDate, getDayName, getStatusColor } from "@/lib/utils"
import { Skeleton } from "../ui/skeleton"
import { t } from "i18next"


const formatTime = (time: string) => {
  const [hours, minutes] = time.split(":")
  const hour = Number.parseInt(hours)
  const ampm = hour >= 12 ? "PM" : "AM"
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minutes} ${ampm}`
}
export default function DoctorDashboard() {

  const { user } = useAuth()
  const {
    scheduledAppointments: { data: scheduledApp = [], isPending: scheduledLoading },
  } = useAppointments()


  const doctor = user as Doctor;
  const shift = doctor.shift;


  return (
    <>
      {/* Welcome Section */}
      <HeadSection>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome, Dr. {user?.name?.split(" ")[0] || "Doctor"}!</h1>
            <p className="text-blue-100">
              You have {scheduledApp.length} appointments today. Manage your patients and track their
              progress.
            </p>
          </div>
          <div className="hidden md:block">
            <Stethoscope className="h-16 w-16 text-blue-200" />
          </div>
        </div>
      </HeadSection>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{scheduledApp.length}</p>
                <p className="text-sm text-gray-600">Total Appointments</p>
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
                <p className="text-2xl font-bold text-gray-900">{scheduledApp.length}</p>
                <p className="text-sm text-gray-600">Upcoming Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              Work Shifts
            </CardTitle>
            <CardDescription>Your fixed working hours</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-gray-900 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 ">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="font-semibold ">
                  {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
                </span>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Working Days:</p>
                <div className="flex flex-wrap gap-1">
                  {shift.days.map((dayIndex: number) => (
                    <Badge key={dayIndex} variant="outline" className="text-xs px-2 py-1">
                      {getDayName(dayIndex)}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Today's Appointments */}
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Upcoming Schedule
              </CardTitle>
              <CardDescription>Your appointments for today</CardDescription>
            </div>
            {scheduledApp.length > 3 && <Link href="/appointments">
              <Button variant="outline" size="sm">
                View All
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>}
          </CardHeader>
          <CardContent className="space-y-4">
            {scheduledLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-4 w-[160px]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : scheduledApp.length > 0 ? (
              scheduledApp.slice(0, 3).map((appointment: Appointment) => (
                <div key={appointment._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-accent rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary rounded-lg">
                      <Users className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-50 text-sm">{appointment?.patient?.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-3 w-3 text-gray-400 dark:text-gray-300" />
                        <span className="text-xs text-gray-500 dark:text-gray-300">{formatDate(appointment.date)}</span>
                      </div>
                    </div>
                  </div>
                  <Badge className={getStatusColor("upcoming")}>{t('dashboard.upcoming')}</Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">{t('dashboard.noAppointmentsToday')}</p>
              </div>
            )
            }
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks for managing your practice</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <Link href="/appointments">
            <Button className="w-full justify-start gap-3 h-auto p-4 bg-transparent" variant="outline">
              <Calendar className="h-5 w-5" />
              <div className="text-left">
                <p className="font-medium">All Appointments</p>
                <p className="text-xs text-gray-500">View schedule</p>
              </div>
            </Button>
          </Link>
          <Link href="/profile">
            <Button className="w-full justify-start gap-3 h-auto p-4 bg-transparent" variant="outline">
              <User className="h-5 w-5" />
              <div className="text-left">
                <p className="font-medium">Update Profile</p>
                <p className="text-xs text-gray-500">Manage your information</p>
              </div>
            </Button>
          </Link>
          {/* </div> */}
        </CardContent>
      </Card>
    </>
  )
}

