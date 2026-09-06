import { Body, Controller, ForbiddenException, Post, Req, Res } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type { Request, Response } from 'express';
import { generateOpaqueToken } from '../../domain/auth-policy';
import { AuthService, type IssuedSession } from '../../application/auth.service';
import { RequestEmailOtpDto, VerifyEmailOtpDto } from './auth.dto';

const cookieBase = () => ({ httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' as const, path: '/' });
const requestContext = (req: Request) => ({ ip: req.ip, userAgent: req.get('user-agent') });
function csrfValid(req: Request): boolean { const cookie = req.cookies?.aq_csrf as string | undefined; const header = req.get('x-csrf-token'); return Boolean(cookie && header && cookie === header); }

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('otp/request')
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  request(@Body() dto: RequestEmailOtpDto) { return this.auth.requestEmailOtp(dto.email); }

  @Post('otp/verify')
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  async verify(@Body() dto: VerifyEmailOtpDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const result = await this.auth.verifyEmailOtp(dto.email, dto.code, requestContext(req));
    const csrfToken = generateOpaqueToken();
    this.setSessionCookies(res, result.session, csrfToken);
    return { authenticated: true, user: result.actor.user, roles: result.actor.roles, csrfToken };
  }

  @Post('refresh')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    if (!csrfValid(req)) throw new ForbiddenException('CSRF validation failed');
    const refresh = req.cookies?.aq_refresh as string | undefined;
    if (!refresh) throw new ForbiddenException('Refresh cookie missing');
    const session = await this.auth.rotateRefresh(refresh, requestContext(req));
    const csrfToken = generateOpaqueToken();
    this.setSessionCookies(res, session, csrfToken);
    return { refreshed: true, csrfToken };
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    if (!csrfValid(req)) throw new ForbiddenException('CSRF validation failed');
    const refresh = req.cookies?.aq_refresh as string | undefined;
    if (refresh) await this.auth.logout(refresh);
    for (const name of ['aq_access','aq_refresh','aq_csrf']) res.clearCookie(name, { path: '/' });
    return { loggedOut: true };
  }

  private setSessionCookies(res: Response, session: IssuedSession, csrfToken: string): void {
    res.cookie('aq_access', session.accessToken, { ...cookieBase(), expires: session.accessExpiresAt });
    res.cookie('aq_refresh', session.refreshToken, { ...cookieBase(), expires: session.refreshExpiresAt });
    res.cookie('aq_csrf', csrfToken, { httpOnly: false, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', expires: session.refreshExpiresAt });
  }
}
