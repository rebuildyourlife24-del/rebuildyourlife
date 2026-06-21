# Walkthrough: De Omega Web Builder & Centrale Materialen

De e-commerce ruggengraat is volledig getransformeerd. We zijn overgestapt van simpele Shopify-integraties naar onze eigen **Omega Web Builder**, gecombineerd met de **Content Forge PR Engine**.

Hier is het resultaat van de operatie:

## 1. De Omega Builder Interface (Jouw Franchise Netwerk)
Ik heb de *Opportunity Engine* (`/dashboard/wealth`) volledig overschreven. Dit is nu het commando centrum voor het genereren van webshops.
- **De 1-Click Generator:** Met één druk op de "Genereer Elite Webshop" knop kiest het systeem een hoog-converterend template en rolt deze uit op een van de subdomeinen (bijv. `shop2.ai-henksemler.nl`).
- **Mollie Routing Zichtbaar:** Je ziet direct dat de 25% Mollie "Tolpoort" actief is voor de gegenereerde shops.

## 2. PR Sector & Content Forge Traffic
Een webshop is niks zonder verkeer. 
- In het vernieuwde dashboard staat nu de **Live Traffic Engine (PR Sector)**. 
- Je ziet hier live welke AI-gegenereerde TikTok campagnes viral gaan (bijv. *"Dubai Lifestyle Hooks"*) en hoeveel weergaven ze per uur binnenhalen. Deze traffic gaat direct naar de Omega webshops.

## 3. Centrale Materialen-Koppeling
Dit was cruciaal: *"zodat er niks ontgaat."*
- Aan de rechterkant van de interface bevindt zich nu de **Centrale Materialen** bibliotheek. 
- Alle AI-renders (zoals `Render_Dubai_001.mp4`), CSV-product bestanden, en marketing teksten staan hier centraal gekoppeld. Er slingert geen data meer rond; alles is strak verbonden aan de desbetreffende webshop.

## 4. De Database Architectuur
Op de achtergrond heb ik `schema.prisma` versterkt met twee nieuwe god-mode modellen:
- `OmegaSite`: Trackt welke template gebruikt is en wat de conversie ratio is.
- `PRCampaign`: Houdt de live status en weergaven van je TikTok/Reels traffic bij, inclusief een harde link (`mediaPath`) naar de centrale materialen bibliotheek.

> [!TIP]
> **Bekijk het Resultaat:** Ga naar **Franchise Netwerk (Opportunity Engine)** in de zijbalk. De interface is nu meedogenloos en ademt het hoogste e-commerce niveau. De Omega Engine is online.
