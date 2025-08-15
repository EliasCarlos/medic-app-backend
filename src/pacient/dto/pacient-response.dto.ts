export class PacientResponseDto {
  id: string;
  name: string;
  birthDate: string;
  email: string;
  phone: string;

  constructor(partial: Partial<PacientResponseDto>) {
    Object.assign(this, partial);
  }
}
