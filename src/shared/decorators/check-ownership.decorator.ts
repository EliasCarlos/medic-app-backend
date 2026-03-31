import { SetMetadata } from '@nestjs/common';

export const IS_OWNER_KEY = 'isOwner';

export interface IsOwnerOptions {
  paramName?: string;
  resourceType?: 'profile' | 'appointment' | 'prescription';
}

export const IsOwner = (
  paramName: string = 'id',
  resourceType: 'profile' | 'appointment' | 'prescription' = 'profile',
) => SetMetadata(IS_OWNER_KEY, { paramName, resourceType });
