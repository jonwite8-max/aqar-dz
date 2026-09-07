import assert from 'node:assert/strict';

const base = process.env.IDENTITY_E2E_BASE_URL ?? 'http://127.0.0.1:4000/api/v1';
const email = `identity-e2e-${Date.now()}@example.test`;
const cookies = new Map();

function absorbCookies(headers) {
  const values = typeof headers.getSetCookie === 'function' ? headers.getSetCookie() : [];
  for (const raw of values) {
    const first = raw.split(';', 1)[0];
    if (!first) continue;
    const index = first.indexOf('=');
    if (index < 0) continue;
    const name = first.slice(0, index);
    const value = first.slice(index + 1);
    if (!value) cookies.delete(name);
    else cookies.set(name, value);
  }
}

async function request(path, { method = 'GET', body, csrf } = {}) {
  const headers = {};
  if (body !== undefined) headers['content-type'] = 'application/json';
  if (csrf) headers['x-csrf-token'] = csrf;
  if (cookies.size) headers.cookie = [...cookies].map(([name, value]) => `${name}=${value}`).join('; ');
  const response = await fetch(`${base}${path}`, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
  absorbCookies(response.headers);
  return response;
}

async function json(response) {
  const text = await response.text();
  return text ? JSON.parse(text) : {};
}

async function waitForApi() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch(`${base}/health`);
      if (response.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error('API did not become healthy');
}

await waitForApi();

const otpRequest = await request('/auth/otp/request', { method: 'POST', body: { email } });
assert.equal(otpRequest.status, 201);
const otp = await json(otpRequest);
assert.equal(otp.accepted, true);
assert.match(otp.devCode ?? '', /^\d{6}$/);

const verifyResponse = await request('/auth/otp/verify', { method: 'POST', body: { email, code: otp.devCode } });
assert.equal(verifyResponse.status, 201);
const verified = await json(verifyResponse);
assert.equal(verified.authenticated, true);
assert.ok(verified.user?.id);
assert.deepEqual(verified.roles, ['user']);
assert.ok(verified.csrfToken);
assert.ok(cookies.has('aq_access'));
assert.ok(cookies.has('aq_refresh'));
assert.ok(cookies.has('aq_csrf'));

const meResponse = await request('/users/me');
assert.equal(meResponse.status, 200);
const me = await json(meResponse);
assert.equal(me.user.id, verified.user.id);
assert.equal(me.user.status, 'active');
assert.ok(me.user.lastLoginAt);
assert.ok(me.user.lastActiveAt);

const firstRefresh = cookies.get('aq_refresh');
const refreshResponse = await request('/auth/refresh', { method: 'POST', csrf: verified.csrfToken });
assert.equal(refreshResponse.status, 201);
const refreshed = await json(refreshResponse);
assert.equal(refreshed.refreshed, true);
assert.ok(refreshed.csrfToken);
assert.notEqual(cookies.get('aq_refresh'), firstRefresh, 'refresh token must rotate');

const meAfterRefresh = await request('/users/me');
assert.equal(meAfterRefresh.status, 200);

const logoutResponse = await request('/auth/logout', { method: 'POST', csrf: refreshed.csrfToken });
assert.equal(logoutResponse.status, 201);
const loggedOut = await json(logoutResponse);
assert.equal(loggedOut.loggedOut, true);
assert.equal(cookies.has('aq_access'), false);
assert.equal(cookies.has('aq_refresh'), false);

const meAfterLogout = await request('/users/me');
assert.equal(meAfterLogout.status, 401);

console.log('identity e2e ok');
