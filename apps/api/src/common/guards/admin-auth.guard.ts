import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Role } from '@bingooo/shared';
import { PrismaService } from '../../database/prisma.service';

export const ROLES_KEY = 'roles';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Admin authentication required.');
    }

    const token = authHeader.split(' ')[1];
    const adminSecret = this.configService.get<string>('JWT_ADMIN_SECRET', 'admin_secret');

    try {
      const payload = this.jwtService.verify(token, { secret: adminSecret });
      const admin = await this.prisma.adminUser.findUnique({
        where: { id: payload.sub }
      });

      if (!admin || !admin.isActive) {
        throw new UnauthorizedException('Admin user not found or inactive.');
      }

      request.admin = admin;

      if (requiredRoles && requiredRoles.length > 0) {
        if (!requiredRoles.includes(admin.role as Role)) {
          throw new ForbiddenException(`Role "${admin.role}" is not authorized for this action.`);
        }
      }

      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired admin token.');
    }
  }
}
