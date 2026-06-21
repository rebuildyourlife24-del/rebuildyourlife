# Het Ultieme Productie-Auth Systeem (Focus: RLS)

Ik heb je verfijnde kadootje (met de specifieke toevoeging voor **RLS - Row Level Security**) ontvangen! Dit maakt het systeem letterlijk onkraakbaar op database-niveau.

Aangezien we al een keiharde basis hebben (Supabase + Prisma + Next.js), gaan we dit exact volgens jouw eisen smeden tot een **military-grade fortress**.

## User Review Required

> [!IMPORTANT]
> Hier is het definitieve aanvalsplan op basis van jouw eisen en de focus op RLS. Lees dit door en geef akkoord, dan start ik met Fase 1!

---

## 1. Huidige Status vs Nieuwe Eisen
We hebben momenteel:
- **Supabase Google OAuth** (werkt perfect)
- **Prisma Database** (met `User` tabel en basic `role` = ADMIN/USER)
- **Middleware** (basic domein-routing en check op de `ryl_session` cookie)

## 2. Het Implementatie Plan

### A. Authenticatie (Registratie & Login)
- **E-mail & Wachtwoord:** Toevoegen van Supabase Auth via e-mail.
- **Wachtwoord Eisen:** Minimaal 12 tekens, speciale tekens, server-side validatie.
- **E-mail Verificatie:** Verplicht voordat je de War Room in mag.
- **Login:** Rate-limiting via Supabase ingebouwd (beschermt tegen brute-force/bots).

### B. Sessies & Wachtwoordbeheer
- **Sessies:** Supabase SSR regelt HttpOnly, Secure, en SameSite cookies. Refresh tokens en sessieverval worden automatisch afgehandeld.
- **Wachtwoord Reset:** Een `auth/forgot-password` en `auth/reset-password` flow implementeren met tijdelijke tokens. Geen plaintext opslag (Supabase gebruikt Argon2/Bcrypt).

### C. Rollen & Rechten (RBAC)
We updaten het Prisma schema met een robuuste RBAC structuur:
- `SUPER_ADMIN` (Jij, 100% toegang)
- `ADMIN` (Beheer)
- `EMPLOYEE` (Medewerker)
- `USER` (Gebruiker, max 75% toegang of per module ingesteld)

### D. RLS (Row Level Security) - De Absolute Focus
> [!TIP]
> Omdat we Prisma gebruiken (wat normaal RLS negeert omdat het inlogt als 'postgres' admin), gaan we RLS afdwingen in Supabase zélf!
- We zetten **RLS aan (Enable RLS)** op élke tabel in Supabase.
- We schrijven harde SQL Policies (bijv: `CREATE POLICY "Users can only read their own data" ON "User" FOR SELECT USING (auth.uid() = id);`).
- Zelfs als een hacker onze API of Frontend weet te omzeilen, zal de Supabase database de aanvraag keihard weigeren omdat de RLS policy het op rijniveau (`Row Level`) blokkeert.

### E. Database & Audit Logs
- Een `AuditLog` tabel om inlogs, mislukte inlogpogingen, en security events te loggen.
- "Soft Delete" mechanisme (`deletedAt` veld) zodat data nooit permanent verloren gaat.

### F. Security & UX
- CSRF, XSS bescherming, security headers via Next.js configuratie.
- Geen service keys in de frontend.
- UX: Alle auth-pagina's (Login, Register, Reset) in de *Apex Predator* / Orion styling. Inclusief mobiel-responsieve error states en loading spinners.

## Open Questions

> [!WARNING]
> 1. Voor "Email & Wachtwoord" registraties verstuurt Supabase standaard mails via hun test-adres (`noreply@mail.app.supabase.io`). Zullen we dat voor nu zo laten, of moet ik direct een eigen SMTP koppelen (bijv. Resend/SendGrid) voor `noreply@ai-henksemler.nl`?
> 2. Geef me het woord "GOGOGO" als we dit gigantische Auth-fort mogen gaan bouwen!
