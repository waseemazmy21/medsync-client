import { Appointment, BookAppointment, UpdateAppointment } from "@/lib/types";
import api from "./axios-instance";

export async function appointments(status: string){
    try {
        // const res = api.get("/appointment?status=upcoming&limit=3")
        const res = await api.get(`/appointment?status=${status}`)
        return res.data
        
    } catch (error) {
        throw new Error("field to fetch appointments")
    }
}


export async function bookAppointment(bookingData: Appointment){
    try {
        // const res = api.get("/appointment?status=upcoming&limit=3")
        const res = await api.post("/appointment", bookingData)
        return res.data
        
    } catch (error) {
        throw new Error("field to bookAppointment")
    }
}

export async function updateAppointment(appointmentID: string, updateData: UpdateAppointment){
    try {
        // const res = api.get("/appointment?status=upcoming&limit=3")
        const res = await api.patch(`/appointment/${appointmentID}`, updateData)
        return res.data
        
    } catch (error) {
        throw new Error("field to bookAppointment")
    }
}