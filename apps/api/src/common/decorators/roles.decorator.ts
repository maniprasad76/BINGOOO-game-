import { SetMetadata } from '@nestjs/common';
import { Role } from '@bingooo/shared';
import { ROLES_KEY } from '../guards/admin-auth.guard';

export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
