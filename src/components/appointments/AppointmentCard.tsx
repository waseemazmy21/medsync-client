import { Building2, Calendar, Edit, Eye, FileText, Pill, Star, User } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { formatDate, getStatusColor } from "@/lib/utils";
import { Button } from "../ui/button";
import { Appointment } from "@/lib/types";
import { Badge } from "../ui/badge";


const isTodayAppointment = (date: Date)=> formatDate(date) == formatDate(new Date())
 

  type Props = {
    handleUpdateAppointment: (appointment: Appointment)=> void;
    handleViewPrescription: (appointment: Appointment)=> void;
    handleReviewAppointment: (appointment: Appointment)=> void;
    appointment: Appointment,
    isDoctor: boolean
  }

export const AppointmentCard = ({ appointment, handleUpdateAppointment, handleViewPrescription,handleReviewAppointment , isDoctor }:Props) => {  
  console.log("prespection", appointment.prescription);
  

  return <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{appointment.patient.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                      <Building2 className="h-4 w-4" />
                      {appointment.department.name}
                    </div>
                  </div>
                </div>
                <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <Calendar className="h-4 w-4" />
                <p className="text-sm">{formatDate(appointment.date)}</p>
                {isTodayAppointment(appointment.date) && 
                <Badge variant="secondary" className="text-xs">today</Badge>
                }
              </div>
              {appointment.notes && (
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <FileText className="h-4 w-4" />
                  <p className="text-sm"><span className="font-medium mb-2">Notes: </span>{appointment.notes}</p>
                </div>
              )}

              {appointment.prescription.length > 0 && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Pill className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-900">Prescription Available</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewPrescription(appointment)}
                    className="text-green-700 border-green-300 hover:bg-green-100"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                </div>
              </div>
              )}
              {appointment.status === "completed" && (
                <div className="mt-4 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-900">Rate this appointment</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReviewAppointment(appointment)}
                      className="text-yellow-700 border-yellow-300 hover:bg-yellow-100"
                    >
                      <Star className="h-3 w-3 mr-1" />
                      Review
                    </Button>
                  </div>
                </div>
              )}

              {appointment.followUpDate && (
                <div className="mt-3 p-4 bg-orange-50 rounded-lg">
                  <h4 className="flex items-center gap-2 font-medium text-orange-900 mb-2">
                    <Calendar className="h-4 w-4" /> Follow-up Appointment 
                    {isTodayAppointment(appointment.followUpDate) && 
                    <Badge variant="secondary" className="text-xs">today</Badge>
                    }
                  </h4>
                  <p className="text-sm text-orange-800">
                    Scheduled for: {formatDate(appointment.followUpDate)}
                  </p>
                </div>
              )}
              {appointment.status === "scheduled" && isDoctor && (
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" onClick={() => console.log("View Details comleted")  } className="flex-1">
                    <Eye className="h-3 w-3 mr-1" />
                    View Details comleted
                  </Button>
                    <Button variant="default" size="sm" onClick={() => handleUpdateAppointment(appointment)} className="flex-1">
                      <Edit className="h-3 w-3 mr-1" />
                      Update
                    </Button>
                </div>
              )}
            </CardContent>
          </Card>
}