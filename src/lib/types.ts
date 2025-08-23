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
  day: (0 | 1 | 2 | 3 | 4 | 5 | 6)[]; // 0: Saturday, 1: Sunday, ..., 6: Friday
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



export type User = {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  department?: Department;
  specialization?: string;
  specializationAr?: string;
  gender: Gender;
  birthDate: Date;
  bloodType: BloodType;
  allergies: string[]
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
  price?: number
}
export type Appointment = {
  _id: string;
  date: Date;
  department?: {
    name: string;
    nameAr: string;
  };
  doctor?: User;
  patient?: User;
}