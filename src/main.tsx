// src/main.tsx
import { createRoot } from 'react-dom/client';

import { AppProvider } from './app/providers/AppProvider';
import { RouterProvider } from './app/router/RouterProvider';
import { config } from './shared/config/env';

// Import global styles
import './app/styles/main.css';

// ================= PERFORMANCE MONITORING =================

if (config.isDevelopment && config.features.debugMode) {
  // Add performance monitoring for development
  let renderCount = 0;

  const originalConsoleLog = console.log;
  console.log = (...args) => {
    originalConsoleLog(`[Render ${++renderCount}]`, ...args);
  };

  // Report web vitals in development
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    getCLS(console.log);
    getFID(console.log);
    getFCP(console.log);
    getLCP(console.log);
    getTTFB(console.log);
  });
}

// ================= ERROR HANDLING =================

// Global error handler
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);

  if (config.isProduction && config.services.sentryDsn) {
    // Send to error tracking service
    // Sentry.captureException(event.error);
  }
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);

  if (config.isProduction && config.services.sentryDsn) {
    // Send to error tracking service
    // Sentry.captureException(event.reason);
  }
});

// ================= DEVELOPMENT TOOLS =================

if (config.isDevelopment) {
  // Add development helpers to window object
  window.__APP_CONFIG__ = config;

  // React DevTools profiler
  if (config.features.enableDevtools) {
    import('@tanstack/react-query-devtools').then(() => {
      console.log('🔧 React Query DevTools loaded');
    });
  }

  // Expose utilities for debugging
  window.__DEBUG__ = {
    config,
    clearStorage: () => {
      localStorage.clear();
      sessionStorage.clear();
      console.log('🧹 Storage cleared');
    },
    reloadApp: () => {
      window.location.reload();
    },
  };

  console.log('🚀 App starting in development mode');
  console.log('🔧 Debug utilities available at window.__DEBUG__');
}

// ================= ANALYTICS INITIALIZATION =================

const initializeAnalytics = async () => {
  if (!config.isProduction) return;

  // Google Analytics
  if (config.services.googleAnalyticsId) {
    const { gtag } = await import('./shared/lib/analytics');
    gtag('config', config.services.googleAnalyticsId);
  }

  // PostHog
  if (config.services.posthogKey) {
    const { posthog } = await import('posthog-js');
    posthog.init(config.services.posthogKey, {
      api_host: 'https://app.posthog.com',
      loaded: (posthog) => {
        if (config.isDevelopment) posthog.debug();
      },
    });
  }
};

// ================= SERVICE WORKER =================

const registerServiceWorker = async () => {
  if (!('serviceWorker' in navigator) || !config.isProduction) {
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    console.log('SW registered: ', registration);
  } catch (registrationError) {
    console.log('SW registration failed: ', registrationError);
  }
};

// ================= APP INITIALIZATION =================

const initializeApp = async () => {
  try {
    // Get root element
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      throw new Error('Root element not found');
    }

    // Create React root (React 19 createRoot API)
    const root = createRoot(rootElement);

    // Set document title
    document.title = config.appName;

    // Set viewport meta tag for mobile
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (!viewportMeta) {
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1.0';
      document.head.appendChild(meta);
    }

    // Initialize analytics in production
    if (config.isProduction) {
      await initializeAnalytics();
    }

    // Register service worker
    await registerServiceWorker();

    // Render app with providers
    root.render(
      <AppProvider>
        <RouterProvider />
      </AppProvider>,
    );

    // Log successful initialization
    if (config.isDevelopment) {
      console.log('✅ App initialized successfully');
      console.log('📱 Features enabled:', config.features);
    }
  } catch (error) {
    console.error('❌ Failed to initialize app:', error);

    // Show fallback error UI
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          font-family: system-ui, -apple-system, sans-serif;
          background: #fafafa;
          color: #333;
          text-align: center;
          padding: 20px;
        ">
          <div>
            <h1 style="margin-bottom: 16px; color: #dc2626;">Fehler beim Laden der Anwendung</h1>
            <p style="margin-bottom: 20px; color: #666;">
              ${config.isDevelopment ? error.message : 'Ein unerwarteter Fehler ist aufgetreten.'}
            </p>
            <button
              onclick="window.location.reload()"
              style="
                background: #2563eb;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 16px;
              "
            >
              Seite neu laden
            </button>
          </div>
        </div>
      `;
    }

    // Report error to monitoring service
    if (config.isProduction && config.services.sentryDsn) {
      // Sentry.captureException(error);
    }
  }
};

// ================= STARTUP =================

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

// ================= DEVELOPMENT HOT RELOAD =================

if (config.isDevelopment && import.meta.hot) {
  import.meta.hot.accept();

  import.meta.hot.dispose(() => {
    console.log('🔄 Hot reload triggered');
  });
}

// ================= TYPE DECLARATIONS =================

declare global {
  interface Window {
    __APP_CONFIG__?: typeof config;
    __DEBUG__?: {
      config: typeof config;
      clearStorage: () => void;
      reloadApp: () => void;
    };
  }
}
