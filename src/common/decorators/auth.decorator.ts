import { SetMetadata } from '@nestjs/common';

export enum Role {
  User = 'user',
  Admin = 'admin',
}

export const IS_PUBLIC_KEY = 'isPublic';
export const ROLES_KEY = 'roles';

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
