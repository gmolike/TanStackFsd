// src/shared/lib/analytics.ts

// ================= GOOGLE ANALYTICS =================

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export const gtag = (...args: any[]): void => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag(...args);
  }
};

// Initialize Google Analytics
export const initializeGoogleAnalytics = (measurementId: string): void => {
  // Add Google Analytics script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  // Initialize dataLayer and gtag
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer?.push(arguments);
  };

  gtag('js', new Date());
  gtag('config', measurementId);
};

// ================= ANALYTICS EVENTS =================

export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number,
): void => {
  gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

export const trackPageView = (url: string, title?: string): void => {
  gtag('event', 'page_view', {
    page_path: url,
    page_title: title,
  });
};

export const trackUserTiming = (
  name: string,
  value: number,
  category?: string,
  label?: string,
): void => {
  gtag('event', 'timing_complete', {
    name,
    value,
    event_category: category || 'Performance',
    event_label: label,
  });
};

export const trackException = (description: string, fatal = false): void => {
  gtag('event', 'exception', {
    description,
    fatal,
  });
};

// ================= E-COMMERCE TRACKING =================

export const trackPurchase = (transactionData: {
  transactionId: string;
  value: number;
  currency: string;
  items: Array<{
    id: string;
    name: string;
    category?: string;
    quantity: number;
    price: number;
  }>;
}): void => {
  gtag('event', 'purchase', {
    transaction_id: transactionData.transactionId,
    value: transactionData.value,
    currency: transactionData.currency,
    items: transactionData.items.map((item) => ({
      item_id: item.id,
      item_name: item.name,
      item_category: item.category,
      quantity: item.quantity,
      price: item.price,
    })),
  });
};

// ================= USER PROPERTIES =================

export const setUserProperties = (properties: Record<string, any>): void => {
  gtag('config', 'GA_MEASUREMENT_ID', {
    user_properties: properties,
  });
};

export const setUserId = (userId: string): void => {
  gtag('config', 'GA_MEASUREMENT_ID', {
    user_id: userId,
  });
};

// ================= CUSTOM DIMENSIONS =================

export const setCustomDimension = (index: number, value: string): void => {
  gtag('config', 'GA_MEASUREMENT_ID', {
    custom_map: {
      [`dimension${index}`]: value,
    },
  });
};

// ================= SOCIAL INTERACTIONS =================

export const trackSocialInteraction = (network: string, action: string, target?: string): void => {
  gtag('event', 'social', {
    social_network: network,
    social_action: action,
    social_target: target,
  });
};

// ================= SEARCH TRACKING =================

export const trackSiteSearch = (searchTerm: string, category?: string): void => {
  gtag('event', 'search', {
    search_term: searchTerm,
    search_category: category,
  });
};

// ================= ENGAGEMENT TRACKING =================

export const trackEngagement = (engagementTime: number, engagementType?: string): void => {
  gtag('event', 'user_engagement', {
    engagement_time_msec: engagementTime,
    engagement_type: engagementType,
  });
};

// ================= CONVERSION TRACKING =================

export const trackConversion = (conversionLabel: string, value?: number): void => {
  gtag('event', 'conversion', {
    send_to: `GA_MEASUREMENT_ID/${conversionLabel}`,
    value: value,
  });
};

// ================= DEBUG MODE =================

export const enableDebugMode = (): void => {
  gtag('config', 'GA_MEASUREMENT_ID', {
    debug_mode: true,
  });
};

// ================= CONSENT MANAGEMENT =================

export const updateConsent = (consentSettings: {
  adStorage?: 'granted' | 'denied';
  analyticsStorage?: 'granted' | 'denied';
  functionalityStorage?: 'granted' | 'denied';
  personalizationStorage?: 'granted' | 'denied';
  securityStorage?: 'granted' | 'denied';
}): void => {
  gtag('consent', 'update', consentSettings);
};
