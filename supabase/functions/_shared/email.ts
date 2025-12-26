import { Resend } from "npm:resend@2.0.0";

export function getResend() {
  const key = Deno.env.get("RESEND_API_KEY");
  if (!key) throw new Error("RESEND_API_KEY is missing");
  return new Resend(key);
}

export function getFromEmail() {
  // Start with onboarding@resend.dev until you verify a domain
  return Deno.env.get("RESEND_FROM_EMAIL") || "onboarding@resend.dev";
}

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function bookingEmail({
  name,
  startTime,
  manage,
}: {
  name: string;
  startTime: string;
  manage: { cancelUrl: string; rescheduleUrl: string };
}) {
  const when = new Date(startTime).toLocaleString();
  return {
    subject: "Your appointment is confirmed ✅",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #22c55e;">Confirmed ✅</h1>
        <p>Hi ${escapeHtml(name)}, your appointment is booked for <strong>${escapeHtml(when)}</strong>.</p>
        <p style="margin-top: 20px;">
          <a href="${escapeHtml(manage.rescheduleUrl)}" style="color: #3b82f6; margin-right: 16px;">Reschedule</a>
          <a href="${escapeHtml(manage.cancelUrl)}" style="color: #ef4444;">Cancel</a>
        </p>
      </div>
    `,
  };
}

export function canceledEmail({ name, startTime }: { name: string; startTime: string }) {
  const when = new Date(startTime).toLocaleString();
  return {
    subject: "Your appointment was canceled",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #ef4444;">Canceled</h1>
        <p>Hi ${escapeHtml(name)}, your appointment for <strong>${escapeHtml(when)}</strong> has been canceled.</p>
      </div>
    `,
  };
}

export function rescheduledEmail({
  name,
  newStartTime,
}: {
  name: string;
  newStartTime: string;
}) {
  const when = new Date(newStartTime).toLocaleString();
  return {
    subject: "Your appointment was rescheduled 🔁",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #3b82f6;">Rescheduled 🔁</h1>
        <p>Hi ${escapeHtml(name)}, your appointment is now set for <strong>${escapeHtml(when)}</strong>.</p>
      </div>
    `,
  };
}
