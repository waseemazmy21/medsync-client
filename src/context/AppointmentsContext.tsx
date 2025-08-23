import { Appointment } from "@/lib/types";
import { appointments } from "@/services/appointmentServices";
import { useQuery } from "@tanstack/react-query";
import { createContext, ReactNode, useMemo } from "react";

type AppointmentsContextType = {
    Appointments: Appointment[] | [];
    pastAppointments: Appointment[] | [];
    upcomingAppointments: Appointment[] | [];
    todayAppointments: Appointment[] | [];
    appointmentsLoading: boolean
};

export const AppointmentsContext = createContext<AppointmentsContextType | undefined>(undefined)

export function AppointmentsProvider({ children }: { children: ReactNode }){
    const {
    data: Appointments= [],
    isLoading: appointmentsLoading,
    error: appointmentsError,
  } = useQuery({
    queryKey: ["appointments"],
    queryFn: async () => {
      const {data} = await appointments()
      console.log("Response DashboardPage",data.appointments);
      
      return data.appointments || []
    },
     
      staleTime: 0.25 * 60 * 1000, // 2 دقائق
      refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    
  })

     const today = new Date();
  // past appointments
  console.log("today",today);
  
  const pastAppointments = useMemo(()=>{
    return Appointments.filter((app: Appointment) => new Date(app.date) < today)
  },[Appointments])

  const upcomingAppointments = useMemo(()=>{
    return Appointments.filter((app: Appointment) => new Date(app.date) > today)
  },[Appointments])

  const todayAppointments = useMemo(()=>{
    return Appointments.filter((app: Appointment) => new Date(app.date) == today)
  },[Appointments])


  return (
    <AppointmentsContext.Provider value={{ Appointments, pastAppointments, upcomingAppointments, todayAppointments, appointmentsLoading}}>
      {children}
    </AppointmentsContext.Provider>
  );
}