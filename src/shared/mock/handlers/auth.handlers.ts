// src/shared/mock/handlers/auth.handlers.ts

import { http, HttpResponse } from 'msw';
import { faker } from '@faker-js/faker';

const API_PREFIX = '/api';

// Mock user storage
const mockUsers = new Map([
  [
    'admin@company.de',
    {
      id: '1',
      email: 'admin@company.de',
      password: 'admin123',
      name: 'Admin User',
      role: 'admin',
    },
  ],
  [
    'user@company.de',
    {
      id: '2',
      email: 'user@company.de',
      password: 'user123',
      name: 'Normal User',
      role: 'user',
    },
  ],
]);

// Mock sessions
const sessions = new Map<string, any>();

export const authHandlers = [
  // POST /api/auth/login
  http.post(`${API_PREFIX}/auth/login`, async ({ request }) => {
    const { email, password } = (await request.json()) as any;

    // Simulate delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const user = mockUsers.get(email);

    if (!user || user.password !== password) {
      return HttpResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Generate session token
    const token = faker.string.uuid();
    sessions.set(token, { ...user, password: undefined });

    return HttpResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    });
  }),

  // POST /api/auth/register
  http.post(`${API_PREFIX}/auth/register`, async ({ request }) => {
    const { email, password, name } = (await request.json()) as any;

    // Simulate delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (mockUsers.has(email)) {
      return HttpResponse.json({ error: 'Email already exists' }, { status: 409 });
    }

    const newUser = {
      id: faker.string.uuid(),
      email,
      password,
      name,
      role: 'user',
    };

    mockUsers.set(email, newUser);

    // Generate session token
    const token = faker.string.uuid();
    sessions.set(token, { ...newUser, password: undefined });

    return HttpResponse.json(
      {
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
        },
        token,
      },
      { status: 201 },
    );
  }),

  // POST /api/auth/logout
  http.post(`${API_PREFIX}/auth/logout`, async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (token) {
      sessions.delete(token);
    }

    return new HttpResponse(null, { status: 204 });
  }),

  // GET /api/auth/me
  http.get(`${API_PREFIX}/auth/me`, async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token || !sessions.has(token)) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = sessions.get(token);
    return HttpResponse.json({ user });
  }),

  // POST /api/auth/refresh
  http.post(`${API_PREFIX}/auth/refresh`, async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    const oldToken = authHeader?.replace('Bearer ', '');

    if (!oldToken || !sessions.has(oldToken)) {
      return HttpResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const user = sessions.get(oldToken);
    sessions.delete(oldToken);

    // Generate new token
    const newToken = faker.string.uuid();
    sessions.set(newToken, user);

    return HttpResponse.json({ token: newToken });
  }),
];
