import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../../auth.service';
import { Role } from 'src/enums/user.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<Role[]>('roles', context.getHandler());

    if (!roles) {
      return true; // If no roles specified, allow access
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user; // Assuming user is added to the request by JWT Auth guard

    if (!user) {
      throw new ForbiddenException('Access denied: User not authenticated');
    }

    // Check if the user's role is one of the allowed roles
    if (!roles.includes(user.role)) {
      throw new ForbiddenException('Access denied: Insufficient role');
    }

    return true;
  }
}
