// src/handlers/index.ts
import { http, HttpResponse } from 'msw';

import { config } from '~/shared/config/env';

// ================= MOCK DATA =================

const mockUsers = [
  {
    id: '1',
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    status: 'active',
    permissions: ['all'],
    roles: ['admin'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    emailVerified: true,
    phoneVerified: false,
    twoFactorEnabled: false,
  },
  {
    id: '2',
    email: 'user@example.com',
    firstName: 'Normal',
    lastName: 'User',
    role: 'user',
    status: 'active',
    permissions: ['read'],
    roles: ['user'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    emailVerified: true,
    phoneVerified: false,
    twoFactorEnabled: false,
  },
];

// ================= HANDLERS =================

export const handlers = [
  // Auth endpoints
  http.post(`${config.apiUrl}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string };

    // Simple mock authentication
    const user = mockUsers.find((u) => u.email === body.email);

    if (user) {
      return HttpResponse.json({
        user,
        tokens: {
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token',
          expiresIn: 3600,
        },
      });
    }

    return HttpResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }),

  http.post(`${config.apiUrl}/auth/logout`, () => {
    return HttpResponse.json({ success: true });
  }),

  http.post(`${config.apiUrl}/auth/refresh`, () => {
    return HttpResponse.json({
      accessToken: 'new-mock-access-token',
      refreshToken: 'new-mock-refresh-token',
      expiresIn: 3600,
    });
  }),

  http.get(`${config.apiUrl}/auth/me`, ({ request }) => {
    const authHeader = request.headers.get('Authorization');

    if (
      authHeader === 'Bearer mock-access-token' ||
      authHeader === 'Bearer new-mock-access-token'
    ) {
      return HttpResponse.json(mockUsers[0]);
    }

    return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }),

  // User endpoints
  http.get(`${config.apiUrl}/users`, ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');

    return HttpResponse.json({
      users: mockUsers,
      total: mockUsers.length,
      page,
      limit,
      totalPages: Math.ceil(mockUsers.length / limit),
      hasNextPage: false,
      hasPrevPage: false,
    });
  }),

  http.get(`${config.apiUrl}/users/:id`, ({ params }) => {
    const user = mockUsers.find((u) => u.id === params.id);

    if (user) {
      return HttpResponse.json(user);
    }

    return HttpResponse.json({ message: 'User not found' }, { status: 404 });
  }),

  http.post(`${config.apiUrl}/users`, async ({ request }) => {
    const body = await request.json();

    const newUser = {
      id: String(mockUsers.length + 1),
      ...body,
      status: 'active',
      permissions: ['read'],
      roles: ['user'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      emailVerified: false,
      phoneVerified: false,
      twoFactorEnabled: false,
    };

    mockUsers.push(newUser);

    return HttpResponse.json(newUser, { status: 201 });
  }),

  http.put(`${config.apiUrl}/users/:id`, async ({ params, request }) => {
    const body = await request.json();
    const userIndex = mockUsers.findIndex((u) => u.id === params.id);

    if (userIndex !== -1) {
      mockUsers[userIndex] = {
        ...mockUsers[userIndex],
        ...body,
        updatedAt: new Date().toISOString(),
      };

      return HttpResponse.json(mockUsers[userIndex]);
    }

    return HttpResponse.json({ message: 'User not found' }, { status: 404 });
  }),

  http.delete(`${config.apiUrl}/users/:id`, ({ params }) => {
    const userIndex = mockUsers.findIndex((u) => u.id === params.id);

    if (userIndex !== -1) {
      mockUsers.splice(userIndex, 1);
      return new HttpResponse(null, { status: 204 });
    }

    return HttpResponse.json({ message: 'User not found' }, { status: 404 });
  }),

  // Catch all handler for unhandled requests
  http.get('*', ({ request }) => {
    console.warn(`Unhandled GET request: ${request.url}`);
    return HttpResponse.json({ message: 'Not found' }, { status: 404 });
  }),

  http.post('*', ({ request }) => {
    console.warn(`Unhandled POST request: ${request.url}`);
    return HttpResponse.json({ message: 'Not found' }, { status: 404 });
  }),
];
