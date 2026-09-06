import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  getHealth() {
    return {
      status: 'ok',
      service: 'aqar-dz-api',
      version: process.env.APP_VERSION ?? '0.2.0',
      timestamp: new Date().toISOString(),
    };
  }
}
