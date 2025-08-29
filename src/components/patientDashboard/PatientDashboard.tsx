"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, Clock, User, Building2, Plus, ArrowRight, Activity, FileText } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { useMemo } from "react"
import { departments } from "@/services/departmentServices"
import { Appointment } from "@/lib/types"
import HeadSection from "@/components/HeadSection"
import { useAuth } from "@/hooks/useAuth"
import { useAppointments } from "@/hooks/useAppointments"
import { useTranslations } from 'next-intl'


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


export default function PatientDashboard() {
  const {user} = useAuth()
  const { pastAppointments, upcomingAppointments, appointmentsLoading} = useAppointments()
  const t = useTranslations('patientDashboard');

  const {
    data: Departments= [],
    isLoading: departmentsLoading,
    error: departmentsError,
  } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const {data} = await departments()
      console.log("Response DashboardPage departments",data.departments);
      
      return data.departments || []
    },
  })

  return (
    <>
      {/* Welcome Section */}
      <HeadSection>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">{t('welcome', { name: user?.name?.split(" ")[0] || 'User' })}</h1>
            <p className="text-blue-100">
              {t('desc')}
            </p>
          </div>
          <div className="hidden md:block">
            <Activity className="h-16 w-16 text-blue-200" />
          </div>
        </div>
      </HeadSection>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-50">{upcomingAppointments.length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('upcomingAppointments')}</p>
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
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-50">{pastAppointments.length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('pastAppointments')}</p>
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
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-50">{Departments.length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('availableDepartments')}</p>
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
                {t('upcomingAppointments')}
              </CardTitle>
              <CardDescription>{t('scheduledAppointments')}</CardDescription>
            </div>
            {upcomingAppointments.length > 3 && <Link href="/dashboard/appointments">
              <Button variant="outline" size="sm">
                {t('viewAll')}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>}
          </CardHeader>
          <CardContent className="space-y-4">
            {appointmentsLoading ? (
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
            ) : upcomingAppointments.length > 0 ? (
              upcomingAppointments.slice(0, 3).map((appointment: Appointment) => (
                <div key={appointment._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-accent rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary rounded-lg">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{appointment.doctor?.name}</p>
                      <p className="text-sm text-gray-600">{appointment.department?.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{formatDate(appointment.date)}</span>
                      </div>
                    </div>
                  </div>
                  <Badge className={getStatusColor("upcoming")}>upcoming</Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">{t('noUpcomingAppointments')}</p>
                <Link href="/departments">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    {t('bookAppointment')}
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
                {t('pastAppointments')}
              </CardTitle>
              <CardDescription>{t('pastAppointmentsDesc')}</CardDescription>
            </div>
            { pastAppointments.length > 3 && <Link href="/dashboard/appointments">
              <Button variant="outline" size="sm">
                {t('viewAll')}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link> }
          </CardHeader>
          <CardContent className="space-y-4">
            {appointmentsLoading ? (
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
            ) : pastAppointments.length > 0 ? (
              pastAppointments.map((appointment: Appointment) => (
                <div key={appointment._id} className="p-4 bg-gray-50 rounded-lg  dark:bg-accent">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <User className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-50">{appointment.doctor?.name || "No doctor"}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{appointment.department?.name || "No department"}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="h-3 w-3 text-gray-400 dark:text-gray-300" />
                          <span className="text-xs text-gray-500 dark:text-gray-300">{formatDate(appointment.date)}</span>
                        </div>
                      </div>
                    </div>
                    <Badge className={getStatusColor("completed")}>completed</Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">{t('noPastAppointments')}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>{t('quickActions')}</CardTitle>
          <CardDescription>{t('quickActionsDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/departments">
              <Button className="w-full justify-start gap-3 h-auto p-4 bg-transparent" variant="outline">
                <Plus className="h-5 w-5" />
                <div className="text-left">
                  <p className="font-medium">{t('bookAppointment')}</p>
                  <p className="text-xs text-gray-500">{t('scheduleWithDoctor')}</p>
                </div>
              </Button>
            </Link>
            <Link href="/profile">
              <Button className="w-full justify-start gap-3 h-auto p-4 bg-transparent" variant="outline">
                <User className="h-5 w-5" />
                <div className="text-left">
                  <p className="font-medium">{t('updateProfile')}</p>
                  <p className="text-xs text-gray-500">{t('manageInfo')}</p>
                </div>
              </Button>
            </Link>
            <Link href="/appointments">
              <Button className="w-full justify-start gap-3 h-auto p-4 bg-transparent" variant="outline">
                <Calendar className="h-5 w-5" />
                <div className="text-left">
                  <p className="font-medium">{t('viewAppointments')}</p>
                  <p className="text-xs text-gray-500">{t('seeAllAppointments')}</p>
                </div>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

