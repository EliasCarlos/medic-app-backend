import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_OWNER_KEY, IsOwnerOptions } from '../decorators/check-ownership.decorator';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class IsOwnerGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const options = this.reflector.getAllAndOverride<IsOwnerOptions>(IS_OWNER_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!options) return true;

    const { paramName = 'id', resourceType = 'profile' } = options;

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const resourceId = request.params[paramName];

    if (!user) return false;

    // Logic for profiles (Doctors or Patients)
    if (resourceType === 'profile') {
      if (resourceId !== user.id) {
        throw new ForbiddenException(
          'You do not have permission to edit or delete this profile',
        );
      }
      return true;
    }

    // Logic for appointments (Doctors or Patients can access if they are linked to it)
    if (resourceType === 'appointment') {
      const appointment = await this.prisma.appointment.findUnique({
        where: { id: resourceId },
      });

      if (!appointment) {
        throw new NotFoundException('Appointment not found');
      }

      if (appointment.doctorId !== user.id && appointment.patientId !== user.id) {
        throw new ForbiddenException(
          'You do not have permission to view or modify this appointment',
        );
      }
      // Attach the resource to the request so the Service doesn't need to fetch it again (optional)
      request.appointment = appointment;
      return true;
    }

    // Logic for prescriptions (Needs to check the related appointment)
    if (resourceType === 'prescription') {
      const prescription = await this.prisma.prescription.findUnique({
        where: { id: resourceId },
        include: { appointment: true },
      });

      if (!prescription) {
        throw new NotFoundException('Prescription not found');
      }

      if (
        prescription.appointment.doctorId !== user.id &&
        prescription.appointment.patientId !== user.id
      ) {
        throw new ForbiddenException(
          'You do not have permission to view or modify this prescription',
        );
      }
      request.prescription = prescription;
      return true;
    }

    return true;
  }
}
