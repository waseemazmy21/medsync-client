"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Star } from "lucide-react"
import { Appointment, ReviewData } from "@/lib/types"
import { addReview } from "@/services/reviewServices"
import { formatDate, handleError } from "@/lib/utils"
import { toast } from "sonner"




interface ReviewModalProps {
  appointment: Appointment | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ReviewModal({ appointment, open, onOpenChange }: ReviewModalProps) {
  const [hoveredRating, setHoveredRating] = useState(0)
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReviewData>({
    defaultValues: {
      rating: undefined,
      feedback: undefined,
    },
  })

  const rating = watch("rating")

  const submitReviewMutation = useMutation({
    mutationFn: async (data: ReviewData) => {
      console.log("data", data);

      const response = await addReview(data)
      console.log("review response", response.data);

      return response.data
    },
    onSuccess: () => {
      toast.success("Thank you for your feedback!")
      queryClient.invalidateQueries({ queryKey: ["completedAppointments"] })
      onOpenChange(false)
      reset()
    },
    onError: (error: any) => {
      toast.error(handleError(error))
    },
  })

  const onSubmit = (data: ReviewData) => {
    if (!appointment) return

    submitReviewMutation.mutate({
      ...data,
      appointment: appointment._id,
      patient: appointment.patient._id,
      doctor: appointment.doctor._id,
      department: appointment.department._id
    })
  }

  const handleRatingClick = (value: number) => {
    setValue("rating", value)
  }

  if (!appointment) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Rate Your Appointment
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Appointment Info */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Appointment Details</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <p>
                <strong>Doctor:</strong> {appointment.doctor.name}
              </p>
              <p>
                <strong>Department:</strong> {appointment.department.name}
              </p>
              <p>
                <strong>Date:</strong> {formatDate(appointment.date)}
              </p>
            </div>
          </div>

          {
            appointment.review ?
              <div className="space-y-6" >
                {/* Rating */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900">
                    Rating <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((value) => (

                      <Star
                        key={value}
                        className={`h-8 w-8 ${appointment.review && value <= appointment?.review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      {rating > 0 && (
                        <>
                          {rating} star{rating !== 1 ? "s" : ""} -{" "}
                          {rating === 1
                            ? "Poor"
                            : rating === 2
                              ? "Fair"
                              : rating === 3
                                ? "Good"
                                : rating === 4
                                  ? "Very Good"
                                  : "Excellent"}
                        </>
                      )}
                    </span>
                  </div>
                  {errors.rating && <p className="text-sm text-red-600">{errors.rating.message}</p>}
                </div>
                {appointment.review.feedback && <div>
                  <strong className="text-sm font-medium text-gray-900">Feedback:</strong>
                  <div className="mt-1 text-sm text-gray-600 whitespace-pre-wrap">
                    {appointment.review.feedback}
                  </div>
                </div>}
              </div> :
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" >

                {/* Rating */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900">
                    Rating <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => handleRatingClick(value)}
                        onMouseEnter={() => setHoveredRating(value)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`h-8 w-8 ${value <= (hoveredRating || rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      {rating > 0 && (
                        <>
                          {rating} star{rating !== 1 ? "s" : ""} -{" "}
                          {rating === 1
                            ? "Poor"
                            : rating === 2
                              ? "Fair"
                              : rating === 3
                                ? "Good"
                                : rating === 4
                                  ? "Very Good"
                                  : "Excellent"}
                        </>
                      )}
                    </span>
                  </div>
                  {errors.rating && <p className="text-sm text-red-600">{errors.rating.message}</p>}
                </div>
                {/* Feedback */}
                <div className="space-y-2">
                  <label htmlFor="feedback" className="text-sm font-medium text-gray-900">
                    Feedback (Optional)
                  </label>
                  <Textarea
                    id="feedback"
                    placeholder="Share your experience with this appointment..."
                    className="min-h-[100px]"
                    {...register("feedback")}
                  />
                  {errors.feedback && <p className="text-sm text-red-600">{errors.feedback.message}</p>}
                </div>
                {/* Actions */}
                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting || rating === 0} className="bg-primary hover:bg-primary/90">
                    {isSubmitting ? "Submitting..." : "Submit Review"}
                  </Button>
                </div>
              </form>
          }
        </div>

      </DialogContent>
    </Dialog>
  )
}
