export type ApiSuccess<T> = { ok: true; data: T; meta?: Record<string, string | number | boolean> };
export type ApiFailure = { ok: false; error: { code: string; message: string; correlationId: string } };
export type ApiResult<T> = ApiSuccess<T> | ApiFailure;
