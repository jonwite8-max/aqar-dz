import { Injectable, NotFoundException } from '@nestjs/common';
import type { QueryExecutor } from '../../../infrastructure/database/query-executor';
import type { User } from '../domain/user';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly users: UsersRepository) {}
  createForRegistration(tx: QueryExecutor): Promise<User> { return this.users.create(tx); }
  removeRegistrationStub(id: string, tx: QueryExecutor): Promise<void> { return this.users.removeRegistrationStub(id, tx); }
  markLogin(id: string, now: Date, tx: QueryExecutor): Promise<void> { return this.users.markLogin(id, now, tx); }
  touchActivity(id: string, now = new Date(), tx?: QueryExecutor): Promise<void> { return this.users.touchActivity(id, now, tx); }
  async getById(id: string, tx?: QueryExecutor): Promise<User> {
    const user = await this.users.findById(id, tx);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
