export class DoctorResponseDto {
  id: string;
  name: string;
  medicalSpecialty: string;
  medicalRegistration: string;
  email: string;
  phone: string;

  constructor(partial: Partial<DoctorResponseDto>) {
    Object.assign(this, partial);
  }
}
