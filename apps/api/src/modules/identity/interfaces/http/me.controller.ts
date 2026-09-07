import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { SessionGuard, type AuthenticatedRequest } from './session.guard';

@Controller('users')
export class MeController {
  @Get('me')
  @UseGuards(SessionGuard)
  me(@Req() request: AuthenticatedRequest) {
    return { user: request.actor.user, roles: request.actor.roles };
  }
}
