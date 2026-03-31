import { Prisma } from '@prisma/client';

export const DOCTOR_SELECT: Prisma.DoctorSelect = {
  id: true,
  name: true,
  medicalSpecialty: true,
  medicalRegistration: true,
  email: true,
  phone: true,
  role: true,
  createdAt: true,
  updatedAt: true,
};

export const PATIENT_SELECT: Prisma.PatientSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  birthDate: true,
  role: true,
  createdAt: true,
  updatedAt: true,
};

export const APPOINTMENT_SELECT: Prisma.AppointmentSelect = {
  id: true,
  date: true,
  doctorId: true,
  patientId: true,
  createdAt: true,
  updatedAt: true,
  doctor: {
    select: {
      id: true,
      name: true,
      medicalSpecialty: true,
    },
  },
  patient: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
};

export const PRESCRIPTION_SELECT: Prisma.PrescriptionSelect = {
  id: true,
  medicine: true,
  dosage: true,
  instructions: true,
  date: true,
  file: true,
  createdAt: true,
  updatedAt: true,
  appointment: {
    select: APPOINTMENT_SELECT,
  },
};
