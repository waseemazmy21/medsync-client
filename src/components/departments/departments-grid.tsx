"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Building2, Search, Calendar, DollarSign } from "lucide-react"
import { Department } from "@/lib/types"
import { departments } from "@/services/departmentServices"
import { BookAppointmentModal } from "../appointments/BookAppointmentModal"
import { getDayName } from "@/lib/utils"
import { toast } from "sonner"
import { useTranslation } from "react-i18next"
import { useLanguage } from "@/context/LanguageContext"


export function DepartmentsGrid() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const { t } = useTranslation()
  const { language } = useLanguage()

  // Fetch departments
  const {
    data: Departments = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const response = await departments()
      console.log("response.data.departments", response.data.departments);

      return response.data.departments || []
    },
  })

  const filteredDepartments = Departments.filter(
    (dept: Department) =>
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (dept.nameAr && dept.nameAr.includes(searchTerm)) ||
      dept.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (dept.descriptionAr && dept.descriptionAr.includes(searchTerm)),
  )

  const handleBookAppointment = (department: Department) => {
    setSelectedDepartment(department)
    setShowBookingModal(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('departments.title')}</h1>
          <p className="text-gray-600">{t('departments.chooseToBook')}</p>
        </div>
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={t('departments.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Departments Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredDepartments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDepartments.map((department: Department) => (
            <Card
              key={department._id}
              className="hover:shadow-lg transition-shadow duration-300"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2 text-gray-900">
                      {language === 'ar' && department.nameAr ? department.nameAr : department.name}
                    </CardTitle>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Building2 className="h-6 w-6 text-primary" />
                    {department.appointmentFee && (
                      <Badge variant="secondary" className="text-xs">
                        <DollarSign className="h-3 w-3 mr-1" />
                        {department.appointmentFee} EGP
                      </Badge>
                    )}
                  </div>
                </div>

                <CardDescription className="text-sm leading-relaxed text-gray-700 mb-4">
                  {language === 'ar' && department.descriptionAr ? department.descriptionAr : department.description}
                </CardDescription>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`h-4 w-4 ${star <= (department.averageRating || 0) ? "text-yellow-400 fill-current" : "text-gray-300"
                            }`}
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-xs text-gray-600">({department.averageRating || 0})</span>
                  </div>

                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.196-2.196M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.196-2.196M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <span>{department.staffCount || 0} {t('departments.staff.1')}</span>
                  </div>
                </div>

                {department.availableDays && department.availableDays.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">{t('departments.availableDays')}:</p>
                    <div className="flex flex-wrap gap-1">
                      {department.availableDays.map((day, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {getDayName(day, t) || `${t('common.days.0')} ${day}`}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardHeader>

              <CardContent className="pt-0">
                <Button onClick={() => {
                  if (department.availableDays.length === 0) {
                    toast.info(t('departments.bookingNotAvailable'))
                    return
                  }
                  handleBookAppointment(department)
                }} className="w-full" size="lg">
                  <Calendar className="h-4 w-4 mr-2" />
                  {t('departments.bookAppointment')}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t('departments.noDepartmentsFound')}</h3>
          <p className="text-gray-600">{t('departments.adjustSearchTerms')}</p>
        </div>
      )}

      {/* Booking Modal */}
      {selectedDepartment && (
        <BookAppointmentModal
          department={selectedDepartment}
          open={showBookingModal}
          onClose={() => {
            setShowBookingModal(false)
            setSelectedDepartment(null)
          }}
        />
      )}
    </div>
  )
}
