import { Appointment, BookAppointment, ReviewData } from "@/lib/types";
import { handleError } from "@/lib/utils";
import { appointments, bookAppointment as bookAppointmentApi, updateAppointment as updateAppointmentApi } from "@/services/appointmentServices";
import { useMutation, UseMutationResult, useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query";
import { createContext, ReactNode } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

type UpdateAppointmentVariables = { data: Appointment; appointmentID: string };

type AppointmentsContextType = {
  scheduledAppointments: UseQueryResult<any, Error>;
  completedAppointments: UseQueryResult<any, Error>;
  bookAppointment: UseMutationResult<Appointment, any, BookAppointment>;
  updateAppointment: UseMutationResult<Appointment, any, UpdateAppointmentVariables>;
};

export const AppointmentsContext = createContext<AppointmentsContextType | undefined>(undefined)

export function AppointmentsProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const { t, i18n } = useTranslation()

  const scheduledAppointments = useQuery({
    queryKey: ["scheduledAppointments"],
    queryFn: async () => {
      const { data } = await appointments("scheduled")

      return data.appointments || []
    }
  })

  const completedAppointments = useQuery({
    queryKey: ["completedAppointments"],
    queryFn: async () => {
      const { data } = await appointments("completed")

      return data.appointments || []
    }
  })

  const bookAppointment = useMutation({
    mutationFn: async (data: BookAppointment) => {
      const response = await bookAppointmentApi(data)
      return response
    },
    onSuccess: (data: any) => {
      const currentLang = i18n.language;
      const msg = currentLang === 'ar' && data?.messageAr ? data.messageAr : (data?.message || t('toast.success.appointmentBooked'))
      toast.success(msg)

      queryClient.invalidateQueries({ queryKey: ["scheduledAppointments"] })
    },
    onError: (error: any) => {
      toast.error(handleError(error, t))
    },
  })

  const updateAppointment = useMutation({
    mutationFn: async ({ data, appointmentID }: UpdateAppointmentVariables) => {
      const response = await updateAppointmentApi(appointmentID, data)
      return response
    },
    onSuccess: (data: any) => {
      const currentLang = i18n.language;
      const msg = currentLang === 'ar' && data?.messageAr ? data.messageAr : (data?.message || t('toast.success.appointmentUpdated'))
      toast.success(msg)

      queryClient.invalidateQueries({ queryKey: ["scheduledAppointments"] })
    },
    onError: (error: any) => {
      toast.error(handleError(error, t));
    },
  })

  const contextValue = { scheduledAppointments, completedAppointments, bookAppointment, updateAppointment }


  return (
    <AppointmentsContext.Provider value={contextValue}>
      {children}
    </AppointmentsContext.Provider>
  );
}