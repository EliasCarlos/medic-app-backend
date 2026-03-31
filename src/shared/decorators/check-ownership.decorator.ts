import { SetMetadata } from '@nestjs/common';

export const IS_OWNER_KEY = 'isOwner';
export const IsOwner = (paramName: string = 'id') => SetMetadata(IS_OWNER_KEY, paramName);
