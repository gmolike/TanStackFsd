// src/shared/mock/handlers/health.handlers.ts

import { http, HttpResponse } from 'msw';

const API_PREFIX = '/api';

export const healthHandlers = [
  // GET /api/health
  http.get(`${API_PREFIX}/health`, () => {
    return HttpResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime ? process.uptime() : 0,
      environment: import.meta.env.MODE,
      version: '1.0.0',
    });
  }),

  // GET /api/health/ready
  http.get(`${API_PREFIX}/health/ready`, () => {
    // Simulate readiness check
    const isReady = Math.random() > 0.1; // 90% success rate

    if (!isReady) {
      return HttpResponse.json(
        {
          status: 'not ready',
          message: 'Service is still initializing',
        },
        { status: 503 },
      );
    }

    return HttpResponse.json({
      status: 'ready',
      timestamp: new Date().toISOString(),
    });
  }),

  // GET /api/health/live
  http.get(`${API_PREFIX}/health/live`, () => {
    return HttpResponse.json({
      status: 'alive',
      timestamp: new Date().toISOString(),
    });
  }),
];
