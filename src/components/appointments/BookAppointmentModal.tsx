"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { useToast } from "@/hooks/use-toast"
import { CalendarIcon, Clock, User, FileText, CheckCircle } from "lucide-react"
// import { format } from "date-fns"
import { cn, formatDate } from "@/lib/utils"
import { BookAppointment, Department } from "@/lib/types"
import { bookAppointment } from "@/services/appointmentServices"
import { Calendar } from "../ui/calender"


interface BookAppointmentModalProps {
  department: Department
  open: boolean
  onClose: () => void
}

export function BookAppointmentModal({ department, open, onClose }: BookAppointmentModalProps) {
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<BookAppointment>({
    defaultValues: {
      department: department._id,
      date: undefined,
      notes: undefined
    },
  })

  register("date", { required: "Please select a date" })

  console.log("BookAppointmentModal day", department.availableDays);
  console.log("BookAppointmentModal day", watch("date")?.getDay());
  
  // Book appointment mutation
  const bookAppointmentMutation = useMutation({
    mutationFn: async (data: BookAppointment) => {
      console.log("bookAppointmentMutation", data);
      
      const response = await bookAppointment(data)
      return response.data
    },
    onSuccess: (data) => {
      console.log("data booked", data);
      
      queryClient.invalidateQueries({ queryKey: ["appointments"] })
      handleClose()
    },
    onError: (error: any) => {
      console.log("onError data booking", error);
    },
  })

  const onSubmit = (data: BookAppointment) => {
    if (!data.date) return
    bookAppointmentMutation.mutate(data)
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            Book Appointment - {department.name}
          </DialogTitle>
          <DialogDescription>
            Follow the steps below to schedule your appointment with one of our specialists.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Select Date</h3>
              </div>
                <div>
                  <Label className="text-sm font-medium mb-2 block">Select Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !watch("date") && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {watch("date")
                        ? formatDate(watch("date") as Date)
                        : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={watch("date") ? watch("date") : undefined}
                        onSelect={(date) => {setValue("date", date, { shouldValidate: true })}}
                        disabled={(date) => date < new Date() || !department.availableDays.includes(+date.getDay())}
                         classNames={{
                          day_disabled: "opacity-40 cursor-not-allowed",
                          day_selected: "bg-primary text-white hover:bg-primary",
                        }}
                        
                      />
                    </PopoverContent>
                     {errors.date && <p className="text-sm text-destructive mt-1">{errors.date.message}</p>}
                  </Popover>
                </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Additional Notes</h3>
              </div>
              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional information or symptoms you'd like to share with the doctor..."
                  {...register("notes")}
                  className="mt-1"
                  rows={4}
                />
              </div>
            </div>
            {watch("date") && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Appointment Summary</h4>
                  <div className="space-y-1 text-sm text-blue-800">
                    <p>
                      <strong>Department:</strong> {department.name}
                    </p>
                    <p>
                      <strong>Date:</strong> {formatDate(watch("date") as Date)}
                    </p>
                    <p>
                      <strong>Fee:</strong> {department.appointmentFee} EGP
                    </p>
                  </div>
                </div>
              )}
            <Button type="submit" disabled={bookAppointmentMutation.isPending} className="min-w-[120px] ">
              {bookAppointmentMutation.isPending ? "Booking..." : "Confirm Booking"}
            </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
