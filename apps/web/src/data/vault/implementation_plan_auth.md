# Implementation Plan: De Kluisdeur (Authenticatie)

Om jouw Command Center te beveiligen tegen indringers en de "God-Mode" limieten te handhaven, bouwen we een keiharde authenticatielaag.

## User Review Required

> [!IMPORTANT]
> **Wachtwoord & Security:** 
> Ik zal een inlogscherm (`/login`) ontwerpen dat er futuristisch en "Opperbaas"-waardig uitziet. Het wachtwoord dat is ingesteld in je database-seed is standaard `Ch@ngeMe!2026`. Zodra je bent ingelogd met `admin@rebuildyourlife.eu` en dit wachtwoord, raad ik je aan dit later via de database direct aan te passen naar een eigen wachtwoord. Ga je akkoord met deze opzet?

## Proposed Changes

We gaan een compleet login-systeem bouwen dat gebruik maakt van Server Actions, HTTP-Only Cookies en Next.js Middleware om routes te beveiligen.

### 1. Dependencies Toevoegen
- Ik zal `bcryptjs` toevoegen aan de frontend-applicatie om wachtwoorden veilig te kunnen verifiëren tegen de hash in de database.

### 2. Login Pagina (De Kluisdeur)
#### [NEW] [apps/command-center/src/app/login/page.tsx](file:///C:/Users/hseml/.gemini/antigravity/scratch/rebuildyourlife/apps/command-center/src/app/login/page.tsx)
- Een visueel indrukwekkend inlogscherm (dark-mode, neon accenten, hacker-vibe).
- Een simpel formulier (Email & Password).
- Foutmeldingen als het inloggen mislukt (bijv. "Toegang Geweigerd").

### 3. Authenticatie Logica (Server Actions)
#### [NEW] [apps/command-center/src/app/actions/auth.ts](file:///C:/Users/hseml/.gemini/antigravity/scratch/rebuildyourlife/apps/command-center/src/app/actions/auth.ts)
- Een beveiligde server-action `login(email, password)`.
- Zoekt de gebruiker op via Prisma.
- Verifieert het wachtwoord met `bcryptjs`.
- Maakt een unieke `Session` aan in de database.
- Plaatst een versleutelde HTTP-Only cookie op je apparaat (zodat hackers hem niet kunnen stelen via JavaScript).

### 4. Route Beveiliging (Middleware)
#### [NEW] [apps/command-center/src/middleware.ts](file:///C:/Users/hseml/.gemini/antigravity/scratch/rebuildyourlife/apps/command-center/src/middleware.ts)
- Een schildwacht-script dat bij élke pagina-aanroep controleert of je een geldige login-cookie hebt.
- Zo niet, en je probeert `/hq` of `/ceo` te bezoeken? Dan word je meedogenloos teruggestuurd naar `/login`.

## Verification Plan
1. Lokaal proberen we `/hq` te openen. We moeten direct geblokkeerd worden en naar `/login` gestuurd worden.
2. Inloggen met `admin@rebuildyourlife.eu` en wachtwoord `Ch@ngeMe!2026`.
3. Succesvolle login moet resulteren in een redirect naar `/hq` (Het Command Center) en toegang tot `/ceo`.
