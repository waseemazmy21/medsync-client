import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Pill } from 'lucide-react'
import { Appointment } from '@/lib/types';
import { formatDate } from '@/lib/utils';

type PrespectionModelProps = {
    onOpenChange: (open: boolean) => void;
    open: boolean;
    appointment: Appointment | null
}

function PrespectionModel({appointment, open, onOpenChange}:PrespectionModelProps ) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pill className="h-5 w-5 text-green-600" />
              Prescription Details
            </DialogTitle>
          </DialogHeader>
          {appointment && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Appointment Information</h4>
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

              {/* {appointment.prescription.length > 0 && ( */}
                <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <h4 className="font-medium text-green-900 mb-2">Prescribed Medication</h4>
                  {appointment.prescription?.map(prescription => 
                  <div key={prescription.medicine} className="space-y-0.5 mb-1.5">
                    <p className="font-medium text-green-800">{prescription.medicine}</p>
                    <p className="text-sm text-green-700">{prescription.dose}</p>
                  </div>
                  )}
                </div>
              {/* )} */}

              {appointment.followUpDate && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Follow-up Appointment</h4>
                  <p className="text-sm text-blue-800">Scheduled for: {formatDate(appointment.followUpDate)}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
  )
}

export default PrespectionModel
