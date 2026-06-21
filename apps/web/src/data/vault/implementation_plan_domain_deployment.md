# Deployment & Domain Mapping (Strato -> Vercel -> Supabase)

Jij hebt besloten dat we de basis direct écht live op het internet gaan zetten voordat we verder bouwen. Een echte Overseer beslissing. We gaan de lokale code verplaatsen naar een globaal netwerk.

Dit is het plan om jouw Strato domeinen, Vercel (hosting) en Supabase (database) in een onbreekbare driehoek aan elkaar te koppelen.

## User Review Required
> [!IMPORTANT]
> Omdat dit om live domeinen en externe hosting gaat, vereist dit plan een paar handmatige stappen van jouw kant. Lees het plan door en klik op **Proceed** om de uitrol te starten.

## Open Questions
> [!WARNING]
> 1. Wat zijn de exacte domeinnamen bij Strato die je wilt koppelen? (Bijv: `rebuildyourlife.nl` of iets anders?)
> 2. Heb je al een (gratis) Vercel-account aangemaakt?

## Proposed Changes / Stappenplan

### Stap 1: Vercel CLI Installatie & Live-gang (Mijn Taak)
- Ik zal de Vercel Command Line Interface (CLI) lokaal installeren via de terminal.
- Ik trigger het deployment-commando. Hierdoor wordt jouw ultra-premium webapplicatie vanaf je computer direct naar de razendsnelle Vercel servers in de cloud gepusht.
- *(Jij zult in je terminal eenmalig moeten inloggen bij Vercel als ik dit trigger).*

### Stap 2: Supabase Koppelen aan Vercel (Mijn Taak)
- Zodra de Vercel-omgeving live staat, moeten we de Supabase "Sleutels" (Anon Key & URL van de Orion database) veilig injecteren in Vercel.
- Dit doen we via Vercel Environment Variables (`.env`).
- Hierdoor kan de live website communiceren met de database, zonder dat hackers je sleutels kunnen stelen.

### Stap 3: Strato DNS Routering (Jouw Taak)
Omdat ik als AI niet kan inloggen in jouw privé Strato-account, moet jij de "pijpleiding" leggen.
- Ik geef je straks de exacte Vercel DNS-records (een A-record en een CNAME).
- Jij logt in bij Strato -> Domain Management -> DNS Beheer.
- Je plakt mijn waarden daar in. 
- Vercel genereert daarna automatisch een bank-grade SSL (HTTPS) certificaat voor je domein.

## Verification Plan

### Manual Verification
1. We navigeren naar jouw eigen Strato-domein (bijv. `jouwdomein.nl`).
2. We controleren of het ultra-premium design laadt met het groene "Slotje" (HTTPS).
3. We vulllen een test e-mail in op de website om te controleren of de data daadwerkelijk veilig landt in jouw Supabase-database.

---
**Actie:** Beantwoord de open vragen (welke domeinen heb je?) en klik op **Proceed** zodat ik de Vercel-upload kan forceren!
