import { Appointment, ReviewData } from "@/lib/types";
import { appointments } from "@/services/appointmentServices";
import { addReview } from "@/services/reviewServices";
import { useMutation, useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query";
import { createContext, ReactNode, useMemo } from "react";

type AppointmentsContextType = {
    scheduledAppointments: UseQueryResult<any, Error>;
    completedAppointments: UseQueryResult<any, Error>;
    todayAppointments: Appointment[];
};

export const AppointmentsContext = createContext<AppointmentsContextType | undefined>(undefined)

export function AppointmentsProvider({ children }: { children: ReactNode }){
  const queryClient = useQueryClient()
  
  const scheduledAppointments = useQuery({
    queryKey: ["scheduledAppointments"],
    queryFn: async () => {
      const {data} = await appointments("scheduled")
      console.log("Response DashboardPage scheduled",data.appointments);
      
      return data.appointments || []
    }
  })

  const completedAppointments = useQuery({
    queryKey: ["completedAppointments"],
    queryFn: async () => {
      const {data} = await appointments("completed")
      console.log("Response DashboardPage completed",data.appointments);
      
      return data.appointments || []
    }
  })

  const todayAppointments = useMemo(()=> {
    const todayScheduled = scheduledAppointments.data?.filter((appointment: Appointment) => new Date(appointment.date).getDate() == new Date().getDate()) || []
    const todayCompleted = completedAppointments.data?.map((appointment: Appointment) => new Date(appointment.date).getDate() == new Date().getDate()) || []

    return [...todayScheduled, ...todayCompleted];
  },[scheduledAppointments, completedAppointments])

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

  const contextValue = { scheduledAppointments, completedAppointments, todayAppointments}


  return (
    <AppointmentsContext.Provider value={contextValue}>
      {children}
    </AppointmentsContext.Provider>
  );
}