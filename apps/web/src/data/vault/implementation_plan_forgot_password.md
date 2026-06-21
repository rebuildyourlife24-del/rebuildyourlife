# Wachtwoord Vergeten Systeem (Email Integratie)

Je klopt helemaal: de "Wachtwoord Vergeten" knop op de website laat momenteel alleen een "succes"-schermpje zien, maar verstuurt in werkelijkheid nog geen email. Dit is een zogenaamde *placeholder* omdat we nog geen **Email Service** hebben gekoppeld.

Om dit écht werkend te maken, moeten we het volgende bouwen:

## Proposed Changes

### 1. Database Update (Prisma)
We moeten een nieuwe tabel toevoegen aan de kluis om reset-codes veilig op te slaan, zodat we zeker weten dat de persoon die op de link klikt ook echt de eigenaar is.
#### [MODIFY] `packages/database/prisma/schema.prisma`
* Toevoegen van het model `PasswordResetToken` met een unieke code en een verloopdatum (bijv. 1 uur geldig).

### 2. Email Provider Koppelen (Resend)
Om geautomatiseerde emails vanuit Vercel te sturen zonder in de spam-folder te komen, gebruiken we **Resend** (de industriestandaard voor Vercel-apps).
#### [NEW] `apps/web/src/lib/email.ts`
* Maken van de koppeling die de emails daadwerkelijk verstuurt.

### 3. Server Actions & Routes
#### [MODIFY] `apps/web/src/app/actions/auth.ts`
* Toevoegen van `forgotPasswordAction` (genereert code, slaat op in DB, verstuurt email).
* Toevoegen van `resetPasswordAction` (controleert code, past wachtwoord aan in DB).
#### [NEW] `apps/web/src/app/auth/reset-password/page.tsx`
* Het nieuwe scherm waar je het daadwerkelijke nieuwe wachtwoord intypt als je vanuit de email klikt.

---

> [!IMPORTANT]
> **Open Vragen voor jou:**
> 1. Om emails te kunnen versturen hebben we een (gratis) account nodig bij een mail-provider zoals **Resend.com**. Wil je dat ik de code daarvoor alvast volledig inbouw, zodat jij straks alleen nog maar de Resend API-sleutel in Vercel hoeft te plakken?
> 2. Wilde je wachtwoord vergeten gebruiken omdat inloggen met `Imperialdreams2055` net wéér niet lukte? Zo ja, dan komt dat doordat de live database het nieuwe wachtwoord nog niet wist! Ik kan een snelle reset-knop voor je bouwen om dit direct in de live database te forceren als je wilt.

Laat me weten of je akkoord bent met dit plan of dat we eerst probleem #2 moeten fixen!
