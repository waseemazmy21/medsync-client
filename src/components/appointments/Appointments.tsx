"use client"

import { useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, FileText, Plus } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { AppointmentCard } from "./AppointmentCard"
import { Appointment } from "@/lib/types"
import { UpdateAppointmentModal } from "./UpdateAppointmentModal"
import HeadSection from "../HeadSection"
import { useAppointments } from "@/hooks/useAppointments"
import { appointments } from "@/services/appointmentServices"
import { useQuery } from "@tanstack/react-query"
import PrespectionModel from "./PrespectionModel"
import { ReviewModal } from "./ReviewModel"
import { useTranslation } from "react-i18next"
import { useLanguage } from "@/context/LanguageContext"


export function Appointments() {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const { t } = useTranslation()
  const { language } = useLanguage()

  const { user } = useAuth()
  const {
    scheduledAppointments: { data: scheduledApp = [], isPending: scheduledLoading },
    completedAppointments: { data: completedApp = [], isPending: completedLoading },
  } = useAppointments()

  const isDoctor = user?.role === "Doctor"
  const isPatient = user?.role === "Patient"

  const handleUpdateAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setShowUpdateModal(true)
  }

  const handleViewPrescription = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setShowPrescriptionModal(true)
  }

  const handleReviewAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setShowReviewModal(true)
  }

  return (
    <div className="space-y-6">
      <HeadSection>
        <h1 className="text-2xl font-bold">{t('appointments.title')}</h1>
        <p className="text-gray-100">
          {isDoctor && t('appointments.doctorDescription')}
          {isPatient && t('appointments.patientDescription')}
        </p>
      </HeadSection>
      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {t('appointments.upcomingAppointments')} ({scheduledApp.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            {t('appointments.completed')} ({completedApp.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {(scheduledApp).length > 0 ? (
            <div className="space-y-4">
              {(scheduledApp).map((appointment: Appointment) => (
                <AppointmentCard key={appointment._id} appointment={appointment}
                  handleUpdateAppointment={handleUpdateAppointment}
                  handleViewPrescription={handleViewPrescription}
                  handleReviewAppointment={handleReviewAppointment}
                  isDoctor={isDoctor} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">{t('appointments.noUpcomingAppointments')}</h3>
                {isDoctor && <p className="text-gray-600 mb-4">{t('appointments.doctorScheduleMessage')}</p>}
                {isPatient && <>
                  <p className="text-gray-600 mb-4">{t('appointments.patientScheduleMessage')}</p>
                  <Link href="/departments">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      {t('appointments.bookAppointment')}
                    </Button>
                  </Link>
                </>}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedApp.length > 0 ? (
            <div className="space-y-4">
              {completedApp.map((appointment: Appointment) => (
                <AppointmentCard key={appointment._id} appointment={appointment}
                  handleUpdateAppointment={handleUpdateAppointment}
                  handleViewPrescription={handleViewPrescription}
                  handleReviewAppointment={handleReviewAppointment}
                  isDoctor={isDoctor} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">{t('appointments.noCompletedAppointments')}</h3>
                <p className="text-gray-600">{t('appointments.completedAppointmentsMessage')}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Update Appointment Modal */}
      {selectedAppointment && 
      <UpdateAppointmentModal
        appointment={selectedAppointment}
        open={showUpdateModal}
        onOpenChange={setShowUpdateModal}
      />
      }

      <PrespectionModel
        appointment={selectedAppointment}
        open={showPrescriptionModal}
        onOpenChange={setShowPrescriptionModal}
      />
   
        <ReviewModal
          appointment={selectedAppointment}
          open={showReviewModal}
          onOpenChange={setShowReviewModal}
          key={selectedAppointment?._id}
        />

    </div>
  )
}
