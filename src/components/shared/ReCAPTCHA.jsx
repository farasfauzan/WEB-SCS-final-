"use client";

import { useEffect, useCallback } from "react";

export default function ReCAPTCHA({ onVerify, onError }) {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  const execute = useCallback(async () => {
    if (typeof window === "undefined" || !(window as any).grecaptcha) {
      onError?.(new Error("reCAPTCHA belum dimuat"));
      return;
    }

    try {
      const token = await (window as any).grecaptcha.execute(siteKey, {
        action: "submit",
      });
      onVerify?.(token);
    } catch (err) {
      onError?.(err);
    }
  }, [siteKey, onVerify, onError]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }, [siteKey]);

  return null;
}
