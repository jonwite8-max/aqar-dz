import type { QueryExecutor } from '../../../infrastructure/database/query-executor';
import type { User } from '../domain/user';

export abstract class UsersRepository {
  abstract create(tx?: QueryExecutor): Promise<User>;
  abstract findById(id: string, tx?: QueryExecutor): Promise<User | null>;
  abstract markLogin(id: string, now: Date, tx?: QueryExecutor): Promise<void>;
  abstract touchActivity(id: string, now: Date, tx?: QueryExecutor): Promise<void>;
  abstract removeRegistrationStub(id: string, tx?: QueryExecutor): Promise<void>;
}
