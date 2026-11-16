import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class CustomerAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    const visitorHeader = request.headers['x-visitor-id'];

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const customer = await this.authService.validateCustomerToken(token);
        request.customer = customer;
        request.customerToken = token;
        return true;
      } catch {
        // Fallback to visitor identification
      }
    }

    // Direct Instant Visitor Access without OTP / Mobile
    const visitorId = visitorHeader || 'guest_' + (request.ip || 'local_visitor');
    const customer = await this.authService.getOrCreateVisitor(visitorId);
    request.customer = customer;
    return true;
  }
}
