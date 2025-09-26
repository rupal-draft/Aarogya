export interface DoctorResponseDTO {
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
  consultationFee: number;
  createdAt: string;
}

export interface DoctorAvailabilityDTO {
  id: string;
  doctorId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  breakStart: string;
  breakEnd: string;
  slotDuration: number;
  isAvailable: boolean;
}

export interface AvailableSlotDTO {
  startTime: string;
  endTime: string;
  available: boolean;
}

export interface DoctorAvailabilityResponse {
  doctor: DoctorResponseDTO;
  availability: DoctorAvailabilityDTO;
  availableSlots: AvailableSlotDTO[];
}
