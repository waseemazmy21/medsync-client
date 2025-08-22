"use client"
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



const EN = {
  bookAppointment: 'Book Appointment',
  dateTime: 'Date & Time',
  doctorId: 'Doctor ID',
  departmentId: 'Department ID',
  notes: 'Notes',
  medicine: 'Medicine',
  dose: 'Dose',
  submit: 'Book Appointment',
  upcomingAppointments: 'Upcoming Appointments',
  loading: 'Loading...',
  error: 'Error fetching data',
  noAppointments: 'No appointments',
  prescription: 'Prescription',
  doctor: 'Doctor',
  department: 'Department',
};

const AR = {
  bookAppointment: 'حجز موعد',
  dateTime: 'التاريخ والوقت',
  doctorId: 'معرف الطبيب',
  departmentId: 'معرف القسم',
  notes: 'ملاحظات',
  medicine: 'الدواء',
  dose: 'الجرعة',
  submit: 'حجز الموعد',
  upcomingAppointments: 'المواعيد القادمة',
  loading: 'جاري التحميل...',
  error: 'حدث خطأ أثناء جلب البيانات',
  noAppointments: 'لا توجد مواعيد',
  prescription: 'الوصفة الطبية',
  doctor: 'الطبيب',
  department: 'القسم',
};

const AppointmentPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [form, setForm] = useState<AppointmentForm>({
    date: '',
    doctor: '',
    department: '',
    notes: '',
    prescription: { medicine: '', dose: '' },
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lang, setLang] = useState<'en' | 'ar'>('en');

  const t = lang === 'ar' ? AR : EN;

  useEffect(() => {
    setLoading(true);
    getAppointments()
      .then(setAppointments)
      .catch(() => setError(t.error))
      .finally(() => setLoading(false));
    // eslint-disable-next-line
  }, [lang]);

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
    setLoading(true);
    setError(null);
    try {
      await createAppointment(form);
      const updated = await getAppointments();
      setAppointments(updated);
    } catch {
      setError(t.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8${lang === 'ar' ? ' text-right' : ''}`}
      dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="flex justify-end mb-4">
        <Button variant="outline" size="sm" onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}>
          {lang === 'ar' ? 'English' : 'العربية'}
        </Button>
      </div>
      <h1 className="text-2xl font-bold mb-6 text-primary">{t.bookAppointment}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">{t.dateTime}</label>
          <input type="datetime-local" name="date" value={form.date} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t.doctorId}</label>
          <input type="text" name="doctor" value={form.doctor} onChange={handleChange} placeholder={t.doctorId} required className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t.departmentId}</label>
          <input type="text" name="department" value={form.department} onChange={handleChange} placeholder={t.departmentId} required className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t.notes}</label>
          <textarea name="notes" value={form.notes} onChange={handleChange} placeholder={t.notes} className="w-full border rounded px-3 py-2" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t.medicine}</label>
            <input type="text" name="medicine" value={form.prescription.medicine} onChange={handleChange} placeholder={t.medicine} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t.dose}</label>
            <input type="text" name="dose" value={form.prescription.dose} onChange={handleChange} placeholder={t.dose} className="w-full border rounded px-3 py-2" />
          </div>
        </div>
        <Button type="submit" className="w-full">{t.submit}</Button>
      </form>
      {loading && <div className="text-center text-muted mt-4">{t.loading}</div>}
      {error && <div className="text-center text-destructive mt-4">{error}</div>}
      <h2 className="text-xl font-semibold mt-10 mb-4 text-primary">{t.upcomingAppointments}</h2>
      <ul className="divide-y divide-muted">
        {appointments.length === 0 && !loading && !error && (
          <li className="py-4 text-center text-muted">{t.noAppointments}</li>
        )}
        {appointments.map((appt) => (
          <li key={appt._id} className="py-4 flex flex-col gap-1">
            <span className="font-medium">{new Date(appt.date).toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US')}</span>
            <span>{t.doctor}: {typeof appt.doctor === 'object' ? appt.doctor.name : appt.doctor}</span>
            <span>{t.department}: {typeof appt.department === 'object' ? appt.department.name : appt.department}</span>
            {appt.notes && <span>{t.notes}: {appt.notes}</span>}
            {appt.prescription && (
              <span>{t.prescription}: {appt.prescription.medicine} ({appt.prescription.dose})</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AppointmentPage;
