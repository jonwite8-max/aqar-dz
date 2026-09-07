import type { QueryResult, QueryResultRow } from 'pg';

export interface QueryExecutor {
  query<T extends QueryResultRow = QueryResultRow>(text: string, values?: unknown[]): Promise<QueryResult<T>>;
}
