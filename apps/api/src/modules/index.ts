import { IdentityModule } from './identity/identity.module';
import { UsersModule } from './users/users.module';
import { AgenciesModule } from './agencies/agencies.module';
import { PropertiesModule } from './properties/properties.module';
import { ListingsModule } from './listings/listings.module';
import { SearchGeoModule } from './search-geo/search-geo.module';
import { SearchRequestsModule } from './search-requests/search-requests.module';
import { MatchingModule } from './matching/matching.module';
import { LeadsViewingsModule } from './leads-viewings/leads-viewings.module';
import { MessagingModule } from './messaging/messaging.module';
import { NotificationsModule } from './notifications/notifications.module';
import { TrustRiskModule } from './trust-risk/trust-risk.module';
import { ModerationModule } from './moderation/moderation.module';
import { BillingModule } from './billing/billing.module';
import { MediaModule } from './media/media.module';
import { AuditModule } from './audit/audit.module';
import { LifecycleModule } from './lifecycle/lifecycle.module';
import { AdminModule } from './admin/admin.module';

export const domainModules = [
  IdentityModule,
  UsersModule,
  AgenciesModule,
  PropertiesModule,
  ListingsModule,
  SearchGeoModule,
  SearchRequestsModule,
  MatchingModule,
  LeadsViewingsModule,
  MessagingModule,
  NotificationsModule,
  TrustRiskModule,
  ModerationModule,
  BillingModule,
  MediaModule,
  AuditModule,
  LifecycleModule,
  AdminModule,
];
