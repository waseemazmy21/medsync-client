"use client"

import { useEffect, useMemo, useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
// import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
// import { useToast } from "@/hooks/use-toast"
import { Pill, Plus, Trash2, CalendarIcon } from "lucide-react"
import { Appointment, Doctor, Prescription, Shift, StatusAppointment, UpdateAppointment } from "@/lib/types"
import { cn, formatDate, handleError } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Calendar } from "../ui/calender"
import { useAuth } from "@/hooks/useAuth"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateAppointment } from "@/services/appointmentServices"
// import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog"
// import { updateAppointmentSchema, type UpdateAppointmentData, type Appointment } from "@/lib/schemas"



interface UpdateAppointmentModalProps {
  appointment: Appointment | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UpdateAppointmentModal({ appointment, open, onOpenChange }: UpdateAppointmentModalProps) {
  // const [isLoading, setIsLoading] = useState(false)
  const queryClient = useQueryClient()
  
  const { user } = useAuth()
  const doctor = user as Doctor
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    control,
    setValue
  } = useForm<UpdateAppointment>({
    defaultValues: {
      prescription: undefined,
      followUpDate: undefined,
      status: undefined
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "prescription",
  })

   useEffect(() => {
    if (appointment) {
      reset({
      prescription: appointment.prescription?.length
        ? appointment.prescription
        : [],
          followUpDate: appointment.followUpDate ?? undefined,
          status: appointment.status ?? undefined,
    });
    }
  }, [appointment, reset])

  const originalData = useMemo(() => {
        console.log("originalData");

    return appointment
      ? {
          prescription: appointment.prescription ?? [],
          followUpDate: appointment.followUpDate ?? undefined,
          status: appointment.status ?? undefined,
        }
      : null
  }, [appointment])
    

  const hasChanges = useMemo(() => {
    if (!originalData) return false

    const current = watch()
    return JSON.stringify(current) !== JSON.stringify(originalData)
  }, [watch(), originalData])
  
 const updateAppointmentMutation = useMutation({
    mutationFn: async (data: UpdateAppointment) => {
      console.log("bookAppointmentMutation", data);
      
      const response = await updateAppointment(appointment?._id as string ,data)
      return response.data
    },
    onSuccess: (data: UpdateAppointment) => {
      console.log("data updated", data);
      
      queryClient.invalidateQueries({ queryKey: ["appointments"] })
      handleClose()
    },
    onError: (error: any) => {
      console.log("onError data updatingggg", handleError(error));
    },
  })

  const onSubmit = async (data: UpdateAppointment) => {
    if (!data.prescription || data.prescription.length === 0) {
      delete (data as any).prescription
    }

    console.log("onSubmit",data);
    
    updateAppointmentMutation.mutate(data)
  }

  const handleClose = () => {
    reset()
    onOpenChange(false)
  }

  const addMedicine = () => {
     const lastIndex = fields.length - 1;
  const lastField = watch("prescription")[lastIndex];
  
  // console.log("addMedicine fields lastIndex", lastIndex);
  // console.log("addMedicine fields", watch("prescription")[lastIndex]);

  if ((!lastField?.medicine?.trim() || !lastField?.dose?.trim()) && fields.length != 0) {
    alert("Please fill in the current medicine and dosage before adding another.");
    return;
  }
    append({ medicine: "", dose: "" })
    
    console.log("addMedicinea2", fields[fields.length -1]);
  }
  
  const removeMedicine = (index: number) => {
    console.log("removeMedicine", fields);
    if (fields.length > 0) {
      remove(index)
    }
  }

  if (!appointment) return null

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto" >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pill className="h-5 w-5 text-primary" />
            Update Appointment - {appointment?.patient?.name}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Appointment Info */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Appointment Information</h4>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <p>
                <strong>Patient:</strong> {appointment?.patient?.name}
              </p>
              <p>
                <strong>Department:</strong> {appointment?.department?.name}
              </p>
              <p>
                <strong>Date:</strong> {formatDate(appointment.date)}
              </p>
            </div>
          </div>

          {/* Hidden appointment ID */}
          {/* <input type="hidden" {...register("appointmentId")} value={appointment._id} /> */}
 <div className="space-y-2">
            <Label htmlFor="status">Appointment Status</Label>
            <Select
              defaultValue={appointment.status}
              onValueChange={(value) =>
                setValue("status", value as StatusAppointment)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && <p className="text-sm text-destructive">{errors.status.message}</p>}
          </div>
          {/* Prescription Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Pill className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-medium text-gray-900">Prescription</h3>
            </div>

            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.medicine} className="p-4 border border-gray-200 rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">Medicine {index + 1}</h4>
                    {/* {fields.length > 1 && ( */}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeMedicine(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    {/* )} */}
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`medicine-${index}`}>Medicine Name</Label>
                      <Input
                        id={`medicine-${index}`}
                        placeholder="e.g., Lisinopril 10mg, Metformin 500mg"
                        {...register(`prescription.${index}.medicine` as const, {
                          required: "medicine is required or delete this field",
                          minLength: {value: 3, message: "Medicine must be at least 3 characters"}
                        })}
                        className={errors.prescription?.[index]?.medicine ? "border-destructive" : ""}
                      />
                      {errors.prescription?.[index]?.medicine && (
                        <p className="text-sm text-destructive">
                          {errors.prescription[index]?.medicine?.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`dose-${index}`}>Dosage Instructions</Label>
                      <Textarea
                        id={`dose-${index}`}
                        // value={field.dose}
                        placeholder="e.g., Take 1 tablet once daily in the morning with food"
                        rows={3}
                        {...register(`prescription.${index}.dose` as const, {
                          required: "Give the patient dosage instructions for this medication.",
                          minLength: {value: 5, message: "Dosage instructions must be at least 5 characters"}
                        })}
                        className={errors.prescription?.[index]?.dose ? "border-destructive" : ""}
                      />
                      {errors.prescription?.[index]?.dose && !errors.prescription?.[index]?.medicine && (
                        <p className="text-sm text-destructive">
                          {errors.prescription[index]?.dose?.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addMedicine}
                disabled={(!watch("prescription")[fields.length-1]?.medicine?.trim() || !watch("prescription")[fields.length-1]?.dose?.trim()) && fields.length != 0}
                className="w-full border-dashed border-2 border-gray-300 hover:border-gray-400 bg-transparent"
              >
                <Plus className="h-4 w-4 mr-2" />
                {fields.length == 0 ? "Add Medicine": "Add Another Medicine"}
              </Button>
            </div>
          </div>

          {/* Follow-up Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-medium text-gray-900">Follow-up Appointment</h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="followUpDate">Follow-up Date (Optional)</Label>
              <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !watch("followUpDate") && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {watch("followUpDate")
                        ? formatDate(watch("followUpDate") as Date)
                        : appointment.date  ? formatDate(appointment?.followUpDate as Date) : "Pick a follow-up Date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={watch("followUpDate") ? watch("followUpDate") : undefined}
                        onSelect={(date) => {setValue("followUpDate", date, { shouldValidate: true })}}
                        // disabled={(date) => date < new Date() || !appointment.doctor.shift.days.includes(+date.getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6)}
                        disabled={(date) => date < new Date() || !doctor.shift.days.includes(+date.getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6)}
                         classNames={{
                          day_disabled: "opacity-40 cursor-not-allowed",
                          day_selected: "bg-primary text-white hover:bg-primary",
                        }}
                      />
                    </PopoverContent>
                  </Popover>
              {errors.followUpDate && <p className="text-sm text-destructive">{errors.followUpDate.message as string}</p>}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || updateAppointmentMutation.isPending || !hasChanges} className="flex-1">
              {isSubmitting || updateAppointmentMutation.isPending ? "Updating..." : "Update Appointment"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
