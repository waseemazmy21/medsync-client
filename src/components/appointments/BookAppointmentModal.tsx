"use client"

import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { useToast } from "@/hooks/use-toast"
import { CalendarIcon, Clock, User, FileText, CheckCircle } from "lucide-react"
// import { format } from "date-fns"
import { cn, formatDate, handleError } from "@/lib/utils"
import { Appointment, BookAppointment, Department } from "@/lib/types"
import { bookAppointment } from "@/services/appointmentServices"
// import { Calendar } from "../ui/calendar"
import { useAppointments } from "@/hooks/useAppointments"
import { useTranslation } from "react-i18next"
import { useLanguage } from "@/context/LanguageContext"


interface BookAppointmentModalProps {
  department: Department
  open: boolean
  onClose: () => void
}

export function BookAppointmentModal({ department, open, onClose }: BookAppointmentModalProps) {
  const {bookAppointment} = useAppointments()
  const { t } = useTranslation()
  const { language } = useLanguage()

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
  

  const onSubmit = (data: BookAppointment) => {
    if (!data.date) return
    bookAppointment.mutate(data)
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
            {t('appointments.bookNew')} - {language === 'ar' && department.nameAr ? department.nameAr : department.name}
          </DialogTitle>
          <DialogDescription>
            {t('appointments.bookingInstructions')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">{t('appointments.selectDate')}</h3>
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">{t('appointments.selectDate')}</Label>
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
                      : t('appointments.pickDate')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    timeZone="UTC"
                    required
                    selected={watch("date") ? watch("date") : undefined}
                    disabled={(date: Date) => date < new Date() || !department.availableDays.includes(date.getDay())}
                    onSelect={(date: Date) => setValue("date", date, { shouldValidate: true })}
                  />
                </PopoverContent>
                {errors.date && <p className="text-sm text-destructive mt-1">{errors.date.message}</p>}
              </Popover>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">{t('appointments.additionalNotes')}</h3>
            </div>
            <div>
              <Label htmlFor="notes">{t('appointments.notesOptional')}</Label>
              <Textarea
                id="notes"
                placeholder={t('appointments.notesPlaceholder')}
                {...register("notes")}
                className="mt-1"
                rows={4}
              />
            </div>
          </div>
          {watch("date") && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">{t('appointments.appointmentSummary')}</h4>
              <div className="space-y-1 text-sm text-blue-800">
                <p>
                  <strong>{t('appointments.department')}:</strong> {language === 'ar' && department.nameAr ? department.nameAr : department.name}
                </p>
                <p>
                  <strong>{t('appointments.date')}:</strong> {formatDate(watch("date") as Date)}
                </p>
                <p>
                  <strong>{t('appointments.fee')}:</strong> {department.appointmentFee} EGP
                </p>
              </div>
            </div>
          )}
          <Button type="submit" disabled={bookAppointment.isPending} className="min-w-[120px] ">
            {bookAppointment.isPending ? t('appointments.booking') : t('appointments.confirmBooking')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
