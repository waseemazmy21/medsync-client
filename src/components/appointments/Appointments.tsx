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


export function Appointments() {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false)
  const [showReviewModal, setShowReviewModal] = useState(false)

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
        <h1 className="text-2xl font-bold">My Appointments</h1>
        <p className="text-gray-100">
          {isDoctor && "Manage your patients appointments and medical records"}
          {isPatient && "Your appointments and medical records"}
        </p>
      </HeadSection>
      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Upcoming Appointments ({scheduledApp.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Completed ({completedApp.length})
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
                <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming appointments</h3>
                {isDoctor && <p className="text-gray-600 mb-4">Schedule appointments with your patients</p>}
                {isPatient && <>
                  <p className="text-gray-600 mb-4">Schedule your next appointment with one of our specialists</p>
                  <Link href="/departments">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Book Appointment
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
                <h3 className="text-lg font-medium text-gray-900 mb-2">No completed appointments</h3>
                <p className="text-gray-600">Completed appointments will appear here</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Update Appointment Modal */}
      <UpdateAppointmentModal
        appointment={selectedAppointment}
        open={showUpdateModal}
        onOpenChange={setShowUpdateModal}
      />

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
