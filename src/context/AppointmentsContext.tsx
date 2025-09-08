import { Appointment, ReviewData } from "@/lib/types";
import { appointments } from "@/services/appointmentServices";
import { addReview } from "@/services/reviewServices";
import { useMutation, useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query";
import { createContext, ReactNode, useMemo } from "react";

type AppointmentsContextType = {
  scheduledAppointments: UseQueryResult<any, Error>;
  completedAppointments: UseQueryResult<any, Error>;
};

export const AppointmentsContext = createContext<AppointmentsContextType | undefined>(undefined)

export function AppointmentsProvider({ children }: { children: ReactNode }) {

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
      console.log("Response DashboardPage completed", data.appointments);

      return data.appointments || []
    }
  })


  //  const submitReviewMutation = useMutation({
  //   mutationFn: async (data: ReviewData) => {
  //     console.log("data", data);

  //     const response = await addReview(data)
  //     console.log("review response",response.data);

  //     return response.data
  //   },
  //   onSuccess: () => {
  //   //   toast({
  //   //     title: "Review submitted",
  //   //     description: "Thank you for your feedback!",
  //   //   })\
  //     console.log("review onSuccess Thank you for your feedback!");

  //     queryClient.invalidateQueries({ queryKey: ["appointments"] })
  //     onOpenChange(false)
  //     reset()
  //   },
  //   onError: (error: any) => {
  //   //   toast({
  //   //     title: "Error",
  //   //     description: error.response?.data?.message || "Failed to submit review",
  //   //     variant: "destructive",
  //   //   })
  //     console.log("review onError",error);

  //   },
  // })

  const contextValue = { scheduledAppointments, completedAppointments }


  return (
    <AppointmentsContext.Provider value={contextValue}>
      {children}
    </AppointmentsContext.Provider>
  );
}