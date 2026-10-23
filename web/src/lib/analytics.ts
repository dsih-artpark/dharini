import posthog, { type CapturedNetworkRequest } from "posthog-js";

import { env } from "@/env";

let initialized = false;

// Session replays keep only the URL path and timing of network requests:
// query strings, headers and bodies can carry names, phone numbers and tokens.
function stripNetworkRequest(
  request: CapturedNetworkRequest,
): CapturedNetworkRequest {
  return {
    ...request,
    name: request.name.split("?")[0],
    requestHeaders: undefined,
    requestBody: undefined,
    responseHeaders: undefined,
    responseBody: undefined,
  };
}

export function initPostHog() {
  if (typeof window === "undefined") return;
  if (initialized) return;
  const posthogKey = env.POSTHOG_KEY;
  if (!posthogKey) {
    console.warn("[Analytics] PostHog key not configured");
    return;
  }

  posthog.init(posthogKey, {
    api_host: env.POSTHOG_HOST || "https://app.posthog.com",
    capture_pageview: false, // Handled manually in PostHogProvider to avoid double tracking
    capture_pageleave: true,
    persistence: "localStorage",
    // Pages show personal data (user and site-owner names, phone numbers,
    // site photos), so nothing on screen reaches PostHog as readable text.
    // These settings take precedence over the masking settings in the
    // PostHog project.
    mask_all_text: true,
    mask_all_element_attributes: true,
    mask_personal_data_properties: true,
    custom_personal_data_properties: ["email", "phone", "token", "otp"],
    session_recording: {
      maskAllInputs: true,
      maskTextSelector: "*",
      // Map tiles and markers are not personal, so maps stay visible.
      blockSelector: "img:not(.leaflet-tile):not(.leaflet-marker-icon), video",
      maskCapturedNetworkRequestFn: stripNetworkRequest,
    },
  });

  initialized = true;
}

export function identifyUser(
  userId: string,
  properties?: Record<string, unknown>,
) {
  if (!initialized) return;
  posthog.identify(userId, properties);
}

export function resetUser() {
  if (!initialized) return;
  posthog.reset();
}

export function trackEvent(
  eventName: string,
  properties?: Record<string, unknown>,
) {
  if (!initialized) {
    console.debug(`[Analytics] Event skipped (not initialized): ${eventName}`);
    return;
  }
  // Strip undefined values from properties before sending
  const cleanedProperties = properties
    ? Object.fromEntries(
        Object.entries(properties).filter(([, v]) => v !== undefined),
      )
    : undefined;
  posthog.capture(eventName, cleanedProperties);
}

// Sanitize error messages to remove potential PII (emails, phone numbers)
function sanitizeErrorForAnalytics(error: string): string {
  // Map known error patterns to safe codes
  const errorMappings: Record<string, string> = {
    "invalid otp": "INVALID_OTP",
    "otp expired": "OTP_EXPIRED",
    "too many attempts": "RATE_LIMITED",
    "user not found": "USER_NOT_FOUND",
    "network error": "NETWORK_ERROR",
  };

  const lowerError = error.toLowerCase();
  for (const [pattern, code] of Object.entries(errorMappings)) {
    if (lowerError.includes(pattern)) {
      return code;
    }
  }

  // Strip potential PII patterns (emails, phone numbers)
  const sanitized = error
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, "[EMAIL]")
    .replace(/\+?[0-9]{10,15}/g, "[PHONE]")
    .replace(/[0-9]{6}/g, "[OTP]");

  // If still looks like it might contain PII, return generic
  if (sanitized.length > 100) {
    return "UNKNOWN_ERROR";
  }

  return sanitized;
}

// Login events
export const analytics = {
  // Auth events
  loginOtpSent: (loginType: "email" | "phone") => {
    trackEvent("login_otp_sent", { login_type: loginType });
  },

  loginSuccess: (loginType: "email" | "phone", userId?: string) => {
    trackEvent("login_success", { login_type: loginType });
    if (userId) {
      identifyUser(userId);
    }
  },

  loginFailed: (loginType: "email" | "phone", error: string) => {
    trackEvent("login_failed", {
      login_type: loginType,
      error: sanitizeErrorForAnalytics(error),
    });
  },

  // 3.2: signup events, mirroring the login ones above.
  signupOtpSent: (loginType: "email" | "phone") => {
    trackEvent("signup_otp_sent", { login_type: loginType });
  },

  signupSuccess: (loginType: "email" | "phone", userId?: string) => {
    trackEvent("signup_success", { login_type: loginType });
    if (userId) {
      identifyUser(userId);
    }
  },

  signupFailed: (loginType: "email" | "phone", error: string) => {
    trackEvent("signup_failed", {
      login_type: loginType,
      error: sanitizeErrorForAnalytics(error),
    });
  },

  logout: () => {
    trackEvent("logout");
    resetUser();
  },

  // Page view events
  dashboardViewed: () => {
    trackEvent("dashboard_viewed");
  },

  labFlowViewed: () => {
    trackEvent("lab_flow_viewed");
  },

  adminFlowViewed: () => {
    trackEvent("admin_flow_viewed");
  },

  // Lab flow detailed events
  labStepStarted: (step: string, sampleId?: string) => {
    trackEvent("lab_step_started", { step, sample_id: sampleId });
  },

  labStepCompleted: (step: string, sampleId?: string) => {
    trackEvent("lab_step_completed", { step, sample_id: sampleId });
  },

  labSampleReceived: (sampleId: string, sampleType?: string) => {
    trackEvent("lab_sample_received", {
      sample_id: sampleId,
      sample_type: sampleType,
    });
  },

  labPreprocessingDone: (sampleId: string) => {
    trackEvent("lab_preprocessing_done", { sample_id: sampleId });
  },

  labExtractionDone: (sampleId: string) => {
    trackEvent("lab_extraction_done", { sample_id: sampleId });
  },

  labTestingStarted: (sampleId: string, testType?: string) => {
    trackEvent("lab_testing_started", {
      sample_id: sampleId,
      test_type: testType,
    });
  },

  labAccessionCompleted: (sampleId: string) => {
    trackEvent("lab_accession_completed", { sample_id: sampleId });
  },

  // Sample list interactions
  sampleSelected: (sampleId: string) => {
    trackEvent("sample_selected", { sample_id: sampleId });
  },

  sampleModalOpened: (sampleId: string) => {
    trackEvent("sample_modal_opened", { sample_id: sampleId });
  },
};

export default analytics;
