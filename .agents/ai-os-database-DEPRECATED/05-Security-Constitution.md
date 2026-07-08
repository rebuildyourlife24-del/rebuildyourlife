# SECURITY CONSTITUTION

## Defensieve Ontwerpprincipes
Binnen The Syndicate gaan we ervan uit dat het systeem continu wordt aangevallen. Beveiliging is geen afterthought; het is ingebed in elke regel code.

## 1. Database Security (Supabase / Prisma)
* **Row Level Security (RLS)**: Waar mogelijk en in productie (Supabase) moet RLS afdwingen dat een User-ID uitsluitend zijn eigen data mag muteren of opvragen.
* **Geen N+1 Queries**: Optimaliseer databasetoegang om Denial of Service (DoS) op de DB te voorkomen door inefficiënte ORM-queries.
* **Encryptie**: API keys (bijv. SendGrid, OpenAI, Shopify) die in de database worden opgeslagen MOETEN geëncrypteerd worden. Gebruik server-side environment variables voor vaste keys.

## 2. API & Endpoint Security
* **Rate Limiting**: Elk publiek endpoint (zoals de AI SEO Audit of Cold Email scraper) moet een rate limiter hebben om API-misbruik en onvoorziene kosten te blokkeren.
* **Validatie**: Valideer álle input met libraries zoals Zod. Vertrouw nooit de client (browser).
* **JWT & Auth**: Alle `/dashboard/*` routes moeten beschermd worden via de Next.js middleware of Supabase Auth. Zonder geldige sessie -> redirect naar `/login`.

## 3. Sentinel Protocol
Het systeem bevat (of zal bevatten) een Sentinel AI (Security Scanner). 
* Zodra nieuwe functionaliteit (bijv. een nieuwe AI Machine) wordt gepusht, controleert Sentinel of rate limits en validatie aanwezig zijn.
* **Fail Open/Fail Closed**: Als validatie faalt, fail CLOSED. Geef geen permissies tenzij expliciet bevestigd.

## 4. Geheimhouding (Secrets)
* Nooit API keys hardcoden in GitHub.
* Let op dat `.env.local` correct in de `.gitignore` staat.
* Log NOOIT volledige request bodies of headers als daar Auth tokens of wachtwoorden in kunnen zitten.
