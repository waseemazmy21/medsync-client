"use client"

import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Building2, Search, Calendar, DollarSign } from "lucide-react"
import { Department } from "@/lib/types"
import { departments } from "@/services/departmentServices"
import { useTranslations } from 'next-intl'
// import { api } from "@/lib/api"
// import type { Department } from "@/lib/schemas"
// import { BookAppointmentModal } from "@/components/appointments/book-appointment-modal"

export function DepartmentsGrid() {
  const [searchTerm, setSearchTerm] = useState("")
  const t = useTranslations('departments');
  // const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null)
  // const [showBookingModal, setShowBookingModal] = useState(false)

  // Fetch departments
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


  const displayDepartments = Departments

  // Filter departments based on search term
  const filteredDepartments = useMemo(()=> {
      return displayDepartments.filter(
      (dept: Department) =>
        dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.nameAr.includes(searchTerm) ||
        dept.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  },[displayDepartments])

  // const handleBookAppointment = (department: Department) => {
  //   setSelectedDepartment(department)
  //   setShowBookingModal(true)
  // }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
          <p className="text-gray-600">{t('chooseDepartment')}</p>
        </div>
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={t('searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Departments Grid */}
      {departmentsLoading ? (
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
            <Card key={department._id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative">
                <img
                  src={department.image || "/placeholder.svg"}
                  alt={department.name}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = "/medical-department.png"
                  }}
                />
                <div className="absolute top-4 right-4">
                  <Badge className="bg-white text-primary border border-primary">
                    <DollarSign className="h-3 w-3 mr-1" />
                    {department.price} {t('price')}
                  </Badge>
                </div>
              </div>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-1">{department.name}</CardTitle>
                    <p className="text-sm text-gray-500 mb-2">{department.nameAr}</p>
                  </div>
                  <Building2 className="h-5 w-5 text-primary flex-shrink-0" />
                </div>
                <CardDescription className="text-sm leading-relaxed">{department.description}</CardDescription>
              </CardHeader>
              {/* <CardContent>
                <Button onClick={() => handleBookAppointment(department)} className="w-full" size="lg">
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Appointment
                </Button>
              </CardContent> */}
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t('noDepartmentsFound')}</h3>
          <p className="text-gray-600">{t('tryAdjustingSearch')}</p>
        </div>
      )}
    </div>
  )
}
