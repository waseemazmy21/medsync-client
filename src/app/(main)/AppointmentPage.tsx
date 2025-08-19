
import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} from '@/services/appointmentService';
import { Button } from '@/components/ui/button';

interface Prescription {
  medicine: string;
  dose: string;
}

interface Appointment {
  _id: string;
  date: string;
  doctor: { _id: string; name: string } | string;
  department: { _id: string; name: string } | string;
  notes?: string;
  prescription?: Prescription;
}

interface AppointmentForm {
  date: string;
  doctor: string;
  department: string;
  notes?: string;
  prescription: Prescription;
}

const AppointmentPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [form, setForm] = useState<AppointmentForm>({
    date: '',
    doctor: '',
    department: '',
    notes: '',
    prescription: { medicine: '', dose: '' },
  });

  useEffect(() => {
    getAppointments().then(setAppointments);
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'medicine' || name === 'dose') {
      setForm((prev) => ({
        ...prev,
        prescription: { ...prev.prescription, [name]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await createAppointment(form);
    const updated = await getAppointments();
    setAppointments(updated);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
      <h1 className="text-2xl font-bold mb-6 text-primary">Book Appointment</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Date & Time</label>
          <input type="datetime-local" name="date" value={form.date} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Doctor ID</label>
          <input type="text" name="doctor" value={form.doctor} onChange={handleChange} placeholder="Doctor ID" required className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Department ID</label>
          <input type="text" name="department" value={form.department} onChange={handleChange} placeholder="Department ID" required className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Notes</label>
          <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Notes" className="w-full border rounded px-3 py-2" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Medicine</label>
            <input type="text" name="medicine" value={form.prescription.medicine} onChange={handleChange} placeholder="Medicine" className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Dose</label>
            <input type="text" name="dose" value={form.prescription.dose} onChange={handleChange} placeholder="Dose" className="w-full border rounded px-3 py-2" />
          </div>
        </div>
        <Button type="submit" className="w-full">Book Appointment</Button>
      </form>
      <h2 className="text-xl font-semibold mt-10 mb-4 text-primary">Upcoming Appointments</h2>
      <ul className="divide-y divide-muted">
        {appointments.map((appt) => (
          <li key={appt._id} className="py-4 flex flex-col gap-1">
            <span className="font-medium">{new Date(appt.date).toLocaleString()}</span>
            <span>Doctor: {typeof appt.doctor === 'object' ? appt.doctor.name : appt.doctor}</span>
            <span>Department: {typeof appt.department === 'object' ? appt.department.name : appt.department}</span>
            {appt.notes && <span>Notes: {appt.notes}</span>}
            {appt.prescription && (
              <span>Prescription: {appt.prescription.medicine} ({appt.prescription.dose})</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AppointmentPage;
