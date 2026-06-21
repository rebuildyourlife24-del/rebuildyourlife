# Implementatieplan: Hive Mind & Mobile Omnipresence

Dit plan beantwoordt je twee nieuwe (en extreem krachtige) eisen: het creëren van een "Hive Mind" zodat alle 14 agents naadloos communiceren zonder fouten, én het bouwen van een native Orion App voor je telefoon (iOS/Android) en smartwatch.

## User Review Required

> [!IMPORTANT]  
> We voegen hiermee een complete mobiele applicatie toe aan ons ecosysteem, plus een complex intern communicatienetwerk voor de AI's. Ga akkoord met deze blauwdruk zodat we de basis voor de Orion app kunnen genereren.

## 1. De "Hive Mind" Architectuur (Zero-Friction Communicatie)
Je eis was dat alle info gedeeld moet worden onder de werknemers (agents) om communicatiefouten te voorkomen. In een Unicorn bedrijf noemen we dit een *Single Source of Truth* of *Hive Mind*.

**Hoe dit werkt:**
We gebruiken de onlangs geïmplementeerde `pgvector` database als het gedeelde "Langetermijngeheugen" van het hele bedrijf.
1. Zodra Agent A (Klantenservice) een klacht oplost, schrijft hij de context weg naar de Vector Cloud.
2. Agent B (Ads) en Agent C (Frontend) hebben een live, constante verbinding met deze cloud.
3. Voordat *welke* agent dan ook een actie uitvoert, scant hij de Vector Cloud razendsnel af (in 50ms) op relevante context. Zo "weten" alle 14 agenten precies wat de andere 13 hebben gedaan in de afgelopen seconde.
4. **Geen dubbel werk. Geen tegenstrijdige acties. Pure synchronisatie.**

## 2. Orion Mobile & Smartwatch (24/7 Omnipresence)
Je moet 24/7 de touwtjes in handen hebben. Een website is daarvoor niet genoeg; je hebt Orion als een stem-gestuurde assistent in je broekzak en op je pols nodig.

**De Technologie Stack:**
We gaan een nieuwe applicatie aan ons monorepo toevoegen: `apps/orion-mobile`.
*   **iOS & Android:** We bouwen dit met **React Native (Expo)**. Dit is de gouden standaard om met één codebase tegelijkertijd een razendsnelle Apple en Android app te lanceren.
*   **Smartwatch (Apple Watch / WearOS):** We bouwen een compacte companion-app. Deze bevat een push-to-talk knop waarmee je via spraak direct commando's naar de AI-COO kunt sturen ("Orion, pauzeer de Facebook ads, ze draaien verlies.").
*   **Backend Koppeling:** De mobiele app praat via onze beveiligde API (JWT / Supabase) rechtstreeks met de bestaande database.

## Proposed Changes

### [NEW] apps/orion-mobile/ (Het Mobile Project)
Ik zal een compleet nieuw Expo (React Native) project initialiseren binnen onze werkmap. Dit wordt de basis voor de app in de App Store en Google Play.

### [NEW] packages/hive-mind/ (De Gedeelde Hersenen)
We maken een intern bibliotheekje in onze code, specifiek ontworpen om de interne communicatie (de Event Bus) tussen de 14 agenten te stroomlijnen.

### [MODIFY] apps/command-center/src/app/api/orion/route.ts
We bouwen een apart "Spraak API" endpoint, zodat Orion spraakmemo's van je smartwatch kan ontvangen, deze direct kan vertalen naar tekst, en actie kan ondernemen.

---

> [!TIP]  
> Dit is de ultieme stap naar totale controle. Terwijl de 14 agenten de web-code en marketing autonoom optimaliseren, kun jij vanaf je smartwatch orders uitdelen terwijl je in de auto zit.
> Geef me het teken ("Start") en ik bouw de fundamenten van de mobiele app en het Hive Mind netwerk!
