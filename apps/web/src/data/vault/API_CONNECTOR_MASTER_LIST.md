# GODBRAIN: API & CONNECTOR MASTER LIST

Dit is de heilige graal voor de connectiviteit van jouw ecosysteem. Om het Godbrain op 100% capaciteit te laten draaien, hebben we de volgende API-sleutels nodig. We kunnen deze morgen (stap voor stap) implementeren.

> [!IMPORTANT]
> Bewaar deze sleutels NOOIT in publieke documenten. Ze worden direct in de kluis van het Godbrain geprogrammeerd en onomkeerbaar versleuteld.

## 1. Shopify API Assimilatie (Fase 1.5)
Dit verbindt jouw twee bestaande Shopify-winkels direct met de Omega Storefronts, zodat bestellingen, voorraad en producten vloeiend doorlopen.

- **Status:** Wacht op invoer
- **Wat hebben we nodig per shop?**
  1. De Shopify Shop URL (bijv. `jouw-shop.myshopify.com`)
  2. Een Admin API Toegangstoken (begint met `shpat_...`)
- **Hoe kom je eraan?**
  - Ga naar je Shopify Dashboard.
  - Klik linksonder op **Instellingen** -> **Apps en verkoopkanalen** -> **App-ontwikkeling**.
  - Maak een nieuwe app aan genaamd 'Godbrain'.
  - Geef de app Lees- en Schrijfrechten voor: `Products`, `Orders`, `Customers`, en `Inventory`.
  - Installeer de app en kopieer de `shpat_` code.

## 2. Mollie / Stripe (Betalingsverwerking - Fase 2)
Voor als we 100% onafhankelijk worden en de Godbrain Checkout lanceren (waarbij we Shopify's kassa passeren om transactiekosten te vermijden).

- **Status:** Gepland voor later
- **Wat hebben we nodig?**
  1. Mollie API Key (Live / Test) of Stripe Secret Key (`sk_live_...`)
- **Hoe kom je eraan?**
  - Mollie Dashboard -> Developers -> API Keys.

## 3. OpenAI / Anthropic (The Core Intelligence)
Dit geeft The Concierge, Marcus, Sophia en Elena hun hersencapaciteit om autonoom te redeneren en content/code/financiën te genereren.

- **Status:** Basis is actief, we gaan opschalen.
- **Wat hebben we nodig?**
  1. OpenAI API Key (`sk-proj-...`) voor GPT-4o.
  2. Anthropic API Key (`sk-ant-...`) voor Claude 3.5 Sonnet (uitstekend in coderen/diep werk).

## 4. Oura Ring API (Biometrische Koppeling)
Voor de Blauwe AI Team HUD, waar we jouw slaap, stress en herstel meten om het algoritme aan te sturen wanneer het autonoom werk moet overnemen.

- **Status:** Interface is live, wacht op echte data.
- **Wat hebben we nodig?**
  1. Oura Personal Access Token.
- **Hoe kom je eraan?**
  - Log in op `cloud.ouraring.com/personal-access-tokens`.

## 5. SendGrid / Resend (E-mail Engine)
Voor transactionele e-mails (facturen, orderbevestigingen) en de AI-gestuurde Marketing Funnels.

- **Status:** Gepland
- **Wat hebben we nodig?**
  1. Resend API Key (`re_...`)
- **Waarom Resend?** Het is sneller, moderner en perfect te integreren met onze React codebase.

---

> [!TIP]
> **Plan voor Morgen:** We beginnen met Nummer 1 (Shopify). Als we die twee winkels in het netwerk pluggen, gaat de War Room échte data en euro's tonen.
