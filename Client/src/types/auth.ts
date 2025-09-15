export interface Doctor {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  specialization: string;
  licenseNumber: string;
  experienceYears: number;
  phone: string;
  address: string;
  imageUrl: string;
  createdAt: string;
}

export interface Patient {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  phone: string;
  address: string;
  imageUrl: string;
  emergencyContact: string;
  emergencyPhone: string;
  createdAt: string;
}
