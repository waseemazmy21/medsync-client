import { Appointment, ReviewData } from "@/lib/types";
import { handleError } from "@/lib/utils";
import { appointments, bookAppointment as bookAppointmentApi, updateAppointment as updateAppointmentApi } from "@/services/appointmentServices";
import { useMutation, UseMutationResult, useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query";
import { createContext, ReactNode } from "react";
import { toast } from "sonner";

type UpdateAppointmentVariables = { data: Appointment; appointmentID: string };

type AppointmentsContextType = {
  scheduledAppointments: UseQueryResult<any, Error>;
  completedAppointments: UseQueryResult<any, Error>;
  bookAppointment: UseMutationResult<Appointment, any, Appointment>;
  updateAppointment: UseMutationResult<Appointment, any, UpdateAppointmentVariables>;
};

export const AppointmentsContext = createContext<AppointmentsContextType | undefined>(undefined)

export function AppointmentsProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()

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
    mutationFn: async (data: Appointment) => {
      const response = await bookAppointmentApi(data)
      return response
    },
    onSuccess: (data) => {
      toast.success(data.message || "Appointment booked successfully")

      queryClient.invalidateQueries({ queryKey: ["scheduledAppointments"] })
    },
    onError: (error: any) => {
      toast.error(handleError(error))
    },
  })

  const updateAppointment = useMutation({
    mutationFn: async ({ data, appointmentID }: UpdateAppointmentVariables) => {
      const response = await updateAppointmentApi(appointmentID, data)
      return response
    },
    onSuccess: (data: any) => {
      toast.success(data.message)
      queryClient.invalidateQueries({ queryKey: ["scheduledAppointments"] })
    },
    onError: (error: any) => {
      toast.success(handleError(error));
    },
  })

  const contextValue = { scheduledAppointments, completedAppointments, bookAppointment, updateAppointment }


  return (
    <AppointmentsContext.Provider value={contextValue}>
      {children}
    </AppointmentsContext.Provider>
  );
}