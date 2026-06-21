# RebuildYourLife - ## 🏢 Bedrijfs Index & Domein Strategie (Voor de CEO)

Dit document dient als de technische index van alle bezittingen van het bedrijf (domeinen, servers, databases). 

### De Domein Strategie
1. **Het Commandocentrum (Overkoepelend)**
   - **Domein:** `henksemler-io.nl` (en `app.henksemler-io.nl`)
   - **Doel:** Dit wordt het ultieme commandocentrum voor *alle* online businesses. De centrale hub waar jij de touwtjes in handen hebt, en mogelijk het overkoepelende dashboard voor je hele imperium.
2. **Het Commerciële Product (RebuildYourLife)**
   - **Domein:** `rebuildyourlife.eu`
   - **Doel:** Dit is de specifieke AI applicatie voor de schuldhulpverlening en life-coaching. Hier draait de moderne Next.js landingspagina voor eindgebruikers. 
   - **Host:** Vercel (Frontend) & Render (Backend)
   - **Let op:** De oude Strato WordPress website is hiermee volledig komen te vervallen.

---

## 🛠️ Technische Infrastructuur Overzicht

Dit is het centrale overzicht van alle diensten die worden gebruikt voor het RebuildYourLife platform. 

> [!IMPORTANT]
> **Veiligheid voorop:** Sla hier NOOIT wachtwoorden direct in op. Gebruik je eigen veilige wachtwoordmanager (zoals in je browser of 1Password) of de lokale `.env` bestanden die niet naar GitHub worden gepusht.

## 1. Domeinnamen (Strato)
- **Domein 1 (WordPress):** `rebuildyourlife.eu`
  - **Doel:** Dit is en blijft de WordPress website (homepagina, marketing, SEO).
  - **Status:** Actief via Strato. Wordt **niet** overschreven door Vercel.
- **Domein 2 (Beschikbaar):** `henksemler-io.nl`
  - **Doel:** Kan gebruikt worden voor het AI platform, óf we gebruiken een subdomein (zoals `app.rebuildyourlife.eu`). Dit bepalen we samen.

### 2. Database (Supabase)
- **Status:** Actief & Geconfigureerd
- **Project URL:** `https://maruupmdslovtfcoxdlu.supabase.co`
- **Wachtwoord:** `12Rebuild1234598`
- **Database URL (Pooler):** `postgresql://postgres.maruupmdslovtfcoxdlu:12Rebuild1234598@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true`
- **Direct URL (Migrations):** `postgresql://postgres.maruupmdslovtfcoxdlu:12Rebuild1234598@aws-0-eu-west-1.pooler.supabase.com:5432/postgres`

### 3. Backend API (Render)
- **Status:** Live
- **Platform:** [Render.com](https://render.com)
- **Naam Service:** `REBUILDYOURLIFE123`
- **Live API URL:** `https://rebuildyourlife123.onrender.com/api/v1`
- **Build Command:** `npm install && npx turbo run db:generate`
- **Start Command:** `npx tsx apps/api/src/server.ts`

### 4. Frontend Web App (Vercel)
- **Status:** Live
- **Platform:** [Vercel.com](https://vercel.com)
- **Tijdelijke URL:** `https://rebuildyourlife-123-web-git-main-rebuildyourlife.vercel.app`
- **Gekoppeld Domein:** *Wordt nog besloten (bijv. henksemler-io.nl of app.rebuildyourlife.eu)*
- **Productie URL:** https://rebuildyourlife.eu
- **Doel:** Host de Next.js webapplicatie en serveert deze aan gebruikers.

## 3. Code Repository (GitHub)
- **Provider:** GitHub
- **Repository:** `rebuildyourlife24-del/REBUILDYOURLIFE123`
- **Branch:** `main`
- **Doel:** Opslag van alle broncode. Vercel haalt hier automatisch de nieuwste code vandaan bij elke push.

## 4. Database (Supabase)
- **Provider:** Supabase
- **Type:** PostgreSQL (met pgvector voor AI)
- **Project ID:** `maruupmdslovtfcoxdlu`
- **DATABASE_URL (Pooler):** `postgresql://postgres.maruupmdslovtfcoxdlu:[WACHTWOORD]@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true`
- **DIRECT_URL (Migraties):** `postgresql://postgres.maruupmdslovtfcoxdlu:[WACHTWOORD]@aws-0-eu-west-1.pooler.supabase.com:5432/postgres`
- **Doel:** Opslaan van alle gebruikersdata, doelen, AI-gesprekken en financiële gegevens.

## 5. Backend API (Render - Gepland)
- **Provider:** Render (of vergelijkbaar)
- **Doel:** Draaien van de Express/Node.js server die de zware logica en AI-integraties afhandelt.
- **Status:** Nog in te stellen.

## 6. Externe API's (Gepland)
- **OpenAI:** Voor de AI Coworkers (CEO, Life Coach, etc.)
- **Email (SMTP):** Voor wachtwoord-resets en notificaties
