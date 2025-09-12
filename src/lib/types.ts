export enum Gender {
  Male = 'male',
  Female = 'female',
}

export enum UserRole {
  Admin = 'Admin',
  Doctor = 'Doctor',
  Nurse = 'Nurse',
  Staff = 'Staff',
  Patient = 'Patient',
}

export type Shift = {
  days: number[]; // 0: Saturday, 1: Sunday, ..., 6: Friday
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
}

export enum BloodType {
  A_POS = 'A+',
  A_NEG = 'A-',
  B_POS = 'B+',
  B_NEG = 'B-',
  AB_POS = 'AB+',
  AB_NEG = 'AB-',
  O_POS = 'O+',
  O_NEG = 'O-',
}

export type loginData = {
    email: string,
    passowrd: string
}


export type registerData = {
    name: string,
    email: string,
    phone: string,
    passowrd: string,
    gender: Gender,
    birthDate: Date,
    bloodType?: BloodType,
    allergies?: string
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  gender: Gender;
  birthDate: Date;
  role: UserRole;
  bloodType: BloodType;
  allergies: string[];
};

export interface Doctor extends User {
  department: Department;
  specialization: string;
  specializationAr: string;
  shift: Shift;
  departmentManager: boolean;
};



export type Department = {
  _id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr?: string;
  numberOfReviews?: number;
  staffCount?: number;
  image?: string;
  appointmentFee?: number;
  averageRating: number;
  availableDays: number[]
}

export type StatusAppointment = "scheduled" | "completed" | "cancelled"

export type Prescription = {
  medicine: string;
  dose: string
}[]

export type Appointment = {
  _id: string;
  date: Date;
  department: Department;
  doctor: Doctor;
  patient: User;
  status: StatusAppointment;
  notes?: string;
  prescription: Prescription;
  followUpDate?: Date
  review?: ReviewData
}

export interface BookAppointment {
  department: string
  date: Date | undefined
  notes: string | undefined
}

export interface UpdateAppointment {
  prescription: Prescription
  followUpDate?: Date
  status?: StatusAppointment,
}

export type ReviewData = {
  rating: number;
  feedback: string;
  patient: string;
  doctor: string;
  appointment: string;
  department: string;
}

export type Notification = {
  _id: string;
  title: string;
  message?: string;
  read: boolean;
  hidden?: boolean;
  createdAt: Date;
}

export interface NotificationsResponse {
  notifications: Notification[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  unreadCount: number;
}

export type Report = {
  _id?: string;
  from: string;
  to: string;
  overview: string
  cons: string[];
  pros: string[];
  averageRating: number;
  totalReviews: number;
  createdAt: Date;
}