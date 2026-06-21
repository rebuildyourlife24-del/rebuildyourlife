# Godbrain Integrations & Automation System

We gaan de Godbrain uitbreiden zodat jij (en toekomstige klanten) nooit meer hoeven te vechten met ingewikkelde Shopify schermen, OAuth errors, of Partner Dashboards. Het platform wordt volledig "self-serve".

## Probleem
Momenteel is er geen plek in de Godbrain waar je gegevens kunt invullen (zoals een Shopify API sleutel of winkel URL). Alles zit "onder de motorkap". Voor toekomstige klanten is dit onwerkbaar. Ze moeten simpelweg een formulier kunnen invullen, of nog beter: met één druk op de knop een winkel laten genereren.

## Oplossing: Twee Fases

We pakken dit in twee stappen aan. Fase 1 is direct uitvoerbaar en lost het acute probleem op. Fase 2 is de "Ultieme God Mode" visie die we daarna bouwen.

### Fase 1: Integraties Dashboard (Nu Bouwen)

We bouwen een nieuwe pagina in de Godbrain: **Dashboard -> Instellingen -> Integraties**.
Hier kunnen gebruikers zelf hun API sleutels beheren.

**Functies:**
- Een strak formulier waar een gebruiker zijn `Shopify Winkel URL` en `Admin API Access Token (shpat_...)` plakt.
- De Godbrain test op de achtergrond direct of de sleutel werkt door een onzichtbare API call (ping) naar Shopify te sturen.
- Als de sleutel klopt, slaat de Godbrain deze veilig versleuteld op in de database (`Franchise` tabel).
- De War Room krijgt vanaf dat moment direct live data.
- **Waarom dit belangrijk is:** Toekomstige klanten krijgen 1 simpele video van 30 seconden te zien: "Maak een aangepaste app in Shopify, plak de sleutel hieronder". Geen OAuth, geen Partner Dashboards, geen errors.

### Fase 2: De Automagic Store Builder (Toekomst)

Dit is de functie waar je net om vroeg: het volledig automatiseren van het aanmaken van winkels.

**Hoe het werkt:**
- Jij (als eigenaar van het platform) configureert eenmalig een **Shopify Partner API key** in de database van Godbrain.
- Een klant klikt in het dashboard op: **[Lanceer Mijn E-commerce Imperium]**.
- De klant typt alleen de gewenste naam van de winkel in (bijv. "My Next Big Thing").
- **De Godbrain doet op de achtergrond:**
  1. Spreekt met de Shopify Partner API om volautomatisch een nieuwe "Development Store" aan te maken.
  2. Installeert automatisch de benodigde Godbrain "Custom App" in die winkel.
  3. Haalt het API token op en koppelt dit aan het account van de klant in Godbrain.
- De klant ziet alleen een laadbalkje en na 1 minuut: "Gefeliciteerd, uw winkel is live en gekoppeld aan de War Room". Ze hebben nooit hoeven inloggen op Shopify.

---

## User Review Required

> [!IMPORTANT]
> **Fase 1 kunnen we nú direct bouwen.** Wil je dat ik de code ga schrijven voor de Integraties-pagina in het dashboard, zodat we vanaf nu altijd API sleutels gewoon simpelweg kunnen invullen?

> [!NOTE]
> Voor **Fase 2** (volledige automatisering) hebben we op termijn toegang nodig tot een speciaal "Shopify Plus" of "Shopify Partner" goedgekeurd account om de Partner GraphQL API te gebruiken voor het aanmaken van winkels. Fase 1 is de noodzakelijke springplank hiernaartoe.

---

## Proposed Changes (Voor Fase 1)

#### [NEW] `apps/web/src/app/dashboard/settings/integrations/page.tsx`
- Een nieuwe pagina in het dashboard met een formulier voor Shopify Credentials.

#### [NEW] `apps/web/src/actions/integrations.ts`
- Server Action om de API sleutels veilig te verifiëren en op te slaan in de database via Prisma.

#### [MODIFY] `apps/web/src/app/dashboard/settings/layout.tsx`
- Voeg de navigatie-link toe naar de Integraties sectie.

## Verification Plan
1. Ik bouw het UI formulier.
2. We testen het formulier door de werkende API sleutel die we zojuist hebben ontdekt (die begon met `shpat_`) daar in te vullen.
3. We verifiëren of de War Room de live data laadt zonder verdere configuratie.
