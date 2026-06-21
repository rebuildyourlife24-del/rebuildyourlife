# Implementatieplan: "The God-Brain" (Agent Hulp-Pakketten)

Je wilt dat de AI niet vanaf nul hoeft te beginnen, maar direct beschikt over de absolute top-tier kennis, strategieën en "hulp pakketten". We gaan de Vector Cloud (jouw Supabase database) tot de nok toe vullen met extreem waardevolle data, zodat elke agent zijn eigen **"Master Toolkit"** heeft.

## User Review Required

> [!IMPORTANT]  
> Bekijk de onderstaande lijst van "Hulp-Pakketten" die we in de Cloud gaan injecteren. Zodra je dit goedkeurt, schrijf ik een geautomatiseerd script dat deze duizenden regels aan strategieën in de Vector-database ramt. 

## Wat we in de Cloud gaan opslaan (De Toolkits)

We gebruiken hiervoor de `EnterpriseDocument` structuur in je database. Zodra een agent een taak krijgt, zoekt hij in milliseconden door deze cloud voor de beste manier om het op te lossen.

### 1. Voor het E-Commerce Team (De Geldmakers)
*   **SEO Agent Toolkit:** Sjablonen voor extreem hoog-converterende landingspagina's, lijsten met top "buyer-intent" keywords, en scripts voor automatische backlink-outreach.
*   **Ad & Social Agent Toolkit:** Best-practices voor Facebook/TikTok ads. "Hook" templates voor video-scripts die de aandacht in de eerste 3 seconden grijpen.
*   **Scraper Agent Toolkit:** De nieuwste methoden om leads te vinden zonder geblokkeerd te worden, inclusief scripts om e-mailadressen te verifiëren.

### 2. Voor het Technische Team (De Bouwers)
*   **DevOps Toolkit:** Scripts voor het optimaal cachen van data (Redis) en het afweren van DDoS-aanvallen. Zorgt dat je servers niet crashen als je viral gaat.
*   **Frontend Toolkit:** Een bibliotheek van "High-Converting UI-componenten" (zoals de perfecte zwevende afreken-knop, of schaarste-timers).
*   **Hyper-Realistic Content Toolkit:** Geoptimaliseerde "Prompts" voor Llama 3 en Stable Diffusion. Dit zijn geheime woordcombinaties waardoor gegenereerde foto's niet van echt te onderscheiden zijn.

### 3. Voor de Board of Directors (CFO / Legal / Risk)
*   **Financial Shield Toolkit:** Algoritmes en regels om transactiekosten tot op de cent te minimaliseren, en belasting-optimalisatie modellen.
*   **Legal & Compliance Toolkit:** Standaard privacy-statements, GDPR-regels en algemene voorwaarden, zodat de AI weigert iets te doen wat juridisch riskant is.

### 4. Autonoom AI-Bankieren (Virtual Cards & Agent Budgets)
*Jouw nieuwste eis verheft dit systeem naar een ongekend niveau. We gaan "Stripe Issuing" of vergelijkbare virtuele creditcards voorbereiden in de database.*
*   **Eigen 'Potjes' per Agent:** De Ads Agent krijgt zijn eigen virtuele creditcard, de DevOps Agent krijgt er een.
*   **Real-time Budgettering:** Zodra een agent winst genereert, vloeit een percentage direct naar de hoofdrekening, en wordt een klein deel automatisch (real-time) teruggestort in het budget-'potje' van de agenten voor herinvestering.
*   **Absolute Controle:** Jij ziet in het Rode Dashboard exact welke AI-agent hoeveel saldo op zijn eigen creditcard heeft staan. Als een agent slecht presteert, bevries je zijn virtuele pas met 1 druk op de knop.

## Proposed Changes

### [NEW] `packages/database/prisma/schema.prisma` (Update)
We voegen twee kritieke modellen toe: `AgentBudget` (het virtuele potje) en `VirtualCard` (de API-sleutel voor de fysieke/virtuele prepaid kaart van de agent).

### [NEW] `packages/database/prisma/seed_toolkits.ts`
Ik ga een massief seed-script bouwen. Dit script bevat honderden geavanceerde strategieën, sjablonen en code-snippets, en injecteert deze direct in je Supabase Vector-database als `EnterpriseDocument`s.

### [MODIFY] `packages/database/package.json`
Ik voeg een commando toe (`npm run seed:toolkits`) zodat we de cloud met 1 druk op de knop kunnen vullen.

---

> [!TIP]  
> Door dit te doen hoeven we de lokale AI (Orion) straks niet meer te "trainen". Hij heeft vanaf minuut 1 toegang tot een wiskundig perfecte encyclopedie van Unicorn-tactieken.
> **Geef groen licht ("Start"), en ik begin met het schrijven van deze gigantische kennis-injectie!**
