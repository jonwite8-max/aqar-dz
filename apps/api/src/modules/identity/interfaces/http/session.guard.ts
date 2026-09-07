import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import { AuthService, type AuthenticatedActor } from '../../application/auth.service';

export type AuthenticatedRequest = Request & { actor: AuthenticatedActor };

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(private readonly auth: AuthService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = request.cookies?.aq_access as string | undefined;
    if (!token) throw new UnauthorizedException('Authentication required');
    request.actor = await this.auth.authenticateAccess(token);
    return true;
  }
}
