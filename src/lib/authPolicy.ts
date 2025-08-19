// src/lib/authPolicy.ts

// ---- Mirrors of your Supabase Auth settings ----
export const OTP_WINDOW_SECONDS = 300;        // 5 minutes (set in Supabase)
export const OTP_RESEND_COOLDOWN_SEC = 45;    // UI throttle for resend

export const PASSWORD_MIN_LEN = 10;
export const PASSWORD_REQUIREMENTS = {
  lower: /[a-z]/,
  upper: /[A-Z]/,
  digit: /[0-9]/,
  // symbol: /[^A-Za-z0-9\s]/, // enable if you add symbol requirement later
};

export function validatePassword(pw: string): string[] {
  const issues: string[] = [];
  if (!pw || pw.length < PASSWORD_MIN_LEN) issues.push(`At least ${PASSWORD_MIN_LEN} characters`);
  if (!PASSWORD_REQUIREMENTS.lower.test(pw)) issues.push("Include a lowercase letter");
  if (!PASSWORD_REQUIREMENTS.upper.test(pw)) issues.push("Include an uppercase letter");
  if (!PASSWORD_REQUIREMENTS.digit.test(pw)) issues.push("Include a number");
  // if (!PASSWORD_REQUIREMENTS.symbol?.test(pw)) issues.push("Include a symbol");
  return issues;
}

// OTP resend throttle (client-side UX only)
const OTP_LOCAL_KEY = "econest_last_otp_sent_at";

export function recordOtpSentNow() {
  localStorage.setItem(OTP_LOCAL_KEY, String(Date.now()));
}

export function secondsUntilOtpAllowed(): number {
  const last = Number(localStorage.getItem(OTP_LOCAL_KEY) || 0);
  const elapsed = (Date.now() - last) / 1000;
  const remain = OTP_RESEND_COOLDOWN_SEC - elapsed;
  return remain > 0 ? Math.ceil(remain) : 0;
}