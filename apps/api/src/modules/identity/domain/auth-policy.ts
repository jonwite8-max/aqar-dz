import { createHmac, createHash, randomBytes, randomInt } from 'node:crypto';

export const OTP_TTL_MINUTES = 10;
export const OTP_MAX_ATTEMPTS = 5;
export const OTP_RESEND_SECONDS = 60;
export const ACCESS_TTL_MINUTES = 15;
export const REFRESH_TTL_DAYS = 30;

export function normalizeEmail(value: string): string { return value.trim().toLowerCase(); }
export function generateOtp(): string { return String(randomInt(100000, 1000000)); }
export function generateOpaqueToken(): string { return randomBytes(32).toString('base64url'); }
export function hashToken(value: string): string { return createHash('sha256').update(value).digest('hex'); }
export function hashWithPepper(value: string, pepper: string): string { return createHmac('sha256', pepper).update(value).digest('hex'); }
export function expiresAfter(now: Date, milliseconds: number): Date { return new Date(now.getTime() + milliseconds); }
