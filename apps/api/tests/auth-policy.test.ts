import test from 'node:test';
import assert from 'node:assert/strict';
import { generateOtp, hashToken, normalizeEmail } from '../src/modules/identity/domain/auth-policy';

test('email normalization is deterministic', () => assert.equal(normalizeEmail('  USER@Example.COM '), 'user@example.com'));
test('OTP is six digits', () => assert.match(generateOtp(), /^\d{6}$/));
test('opaque token hashing is deterministic and does not preserve raw token', () => { const hash = hashToken('secret'); assert.equal(hash, hashToken('secret')); assert.notEqual(hash, 'secret'); });
