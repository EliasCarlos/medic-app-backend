export type DoctorSelect = {
  id: string;
  name: string;
  medicalSpecialty: string;
  medicalRegistration: string;
  email: string;
  phone: string;
};

export interface AppointmentEntity {
  id: string;
  date: Date;
  doctorId: string;
  pacientId: string;
  createdAt: Date;
  updatedAt: Date;
}
