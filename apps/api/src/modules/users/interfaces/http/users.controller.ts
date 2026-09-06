import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { SessionGuard, type AuthenticatedRequest } from '../../../identity/interfaces/http/session.guard';

@Controller('users')
export class UsersController {
  @Get('me')
  @UseGuards(SessionGuard)
  me(@Req() request: AuthenticatedRequest) { return { user: request.actor.user, roles: request.actor.roles }; }
}
