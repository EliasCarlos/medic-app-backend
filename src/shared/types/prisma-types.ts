export type DoctorSelect = {
  id: string;
  name: string;
  medicalSpecialty: string;
  medicalRegistration: string;
  email: string;
  phone: string;
  role: string;
};

export interface AppointmentEntity {
  id: string;
  date: Date;
  doctorId: string;
  patientId: string;
  createdAt: Date;
  updatedAt: Date;
}
