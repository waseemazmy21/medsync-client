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
  id: string;
  name: string;
  email: string;
  image?: string;
  phone: string;
  gender: Gender;
  birthDate: Date;
  bloodType: BloodType;
  allergies: string[]
};