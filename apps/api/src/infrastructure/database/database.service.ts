import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Pool, type QueryResult, type QueryResultRow } from 'pg';
import type { QueryExecutor } from './query-executor';

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

@Injectable()
export class DatabaseService implements QueryExecutor, OnModuleDestroy {
  private readonly pool = new Pool({
    connectionString: required('DATABASE_URL'),
    max: Number(process.env.DATABASE_POOL_MAX ?? 20),
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
  });

  query<T extends QueryResultRow = QueryResultRow>(text: string, values: unknown[] = []): Promise<QueryResult<T>> {
    return this.pool.query<T>(text, values);
  }

  async transaction<T>(work: (tx: QueryExecutor) => Promise<T>): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const tx: QueryExecutor = { query: (text, values = []) => client.query(text, values) };
      const result = await work(tx);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.pool.end();
  }
}
