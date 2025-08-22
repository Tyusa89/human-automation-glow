# 📘 EcoNest Core v1 — Go-Live Checklist

This checklist ensures EcoNest AI Core is fully functional and secure before launch.

---

### 🔑 Authentication

- [ ] **Magic Link**
  - Request works, email arrives, login successful
  - Cooldown enforces “Resend in Ns”
  - Expiry: link fails after ~5 minutes

- [ ] **Email + Password**
  - Weak password blocked client-side
  - Strong password signs up successfully
  - “Forgot password” email resets account

---

### 👤 Profiles

- [ ] Profile row created automatically on signup  
- [ ] Owner’s profile role = `owner`  
- [ ] New user profile role = `user`  

---

### 🔐 RLS & Permissions

- [ ] Owner/Admin: access to Leads, Tasks, KB, Results, Traces  
- [ ] User: access to own Tasks/Notes/Meetings only  
- [ ] User: **cannot** see Results/Traces (tabs hidden + guard page)  
- [ ] Public Contact Form (logged out) → still creates lead  

---

### ⚙️ Edge Functions

- [ ] `run-task` function deployed with JWT ON  
- [ ] Task runs successfully from Tasks tab (e.g., `daily_kpi`)  
- [ ] Results row created with correct `user_id`  
- [ ] Error tasks logged with `status='error'` + error message  

---

### 📊 Dashboard

- [ ] Cards update (Leads, Tasks, KB, Traces)  
- [ ] Tabs render without console errors  

---

### 🔐 Supabase Settings

- [ ] **Email OTP Expiration:** 120–300 seconds (recommended 300)  
- [ ] **Prevent use of leaked passwords:** ON  
- [ ] **Secure password change:** ON  
- [ ] **Secure email change:** ON  
- [ ] **Rate limits:** reasonable (token verifications 10–30 per 5 min)  

---

### 🧱 Database & Policies

- [ ] `profiles` contains owner/admin rows  
- [ ] All tables (`tasks`, `notes`, `meetings`, `results`, `traces`) include `user_id`  
- [ ] Policies in place:
  - Owner/Admin override  
  - Results: admin-only read  
  - Traces: admin-only  
  - Leads: anon insert; admin read-all  
- [ ] Functions use `search_path = public`  

---

### 🚀 Go-Live Prep

- [ ] Supabase **Site URL** set to deployed app domain  
- [ ] Email templates (magic link, reset) branded with EcoNest AI  
- [ ] Cron schedule for `daily_kpi` set up (optional)  
- [ ] Privacy Policy & Terms links in footer  

---

### 🧪 Smoke Test

- [ ] **User A (owner)**: full access  
- [ ] **User B (normal)**: own data only; blocked from Results/Traces  
- [ ] Both users: can create + view their own tasks/notes/meetings  
- [ ] Error logging visible in Results/Traces  

---

### 📈 Monitoring (Post-Launch)

- Supabase Auth → Logs (OTP failures, rate limits)  
- Table Editor → Results (scan error logs)  
- Add dashboard alert if errors > N in last 24h (optional future)  

---

✅ When every box is checked, EcoNest Core v1 is ready for production.  
