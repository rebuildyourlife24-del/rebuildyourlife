# Implementation Plan: CEO / Admin Dashboard (The "Business Hub")

Je hebt de `HQ` ("Command Center") voor de brute actie en live monitoring, maar je hebt een **CEO Dashboard** nodig voor strategisch overzicht, bedrijfsvoering en persoonlijke ontwikkeling. 

Dit dashboard wordt de plek waar alle AI-acties worden vertaald naar keiharde cijfers (grafieken, ROI, traffic) én waar de AI aan jou uitlegt *waarom* bepaalde keuzes zijn gemaakt. Dit zorgt ervoor dat jij meegroeit met het systeem als CEO. Daarnaast bereiden we dit direct voor op meerdere bedrijven/webshops in de toekomst.

## User Review Required

> [!IMPORTANT]
> **Educatieve Laag:** We gaan een systeem bouwen waarbij elke grafiek of beslissing van de AI een "Explain" (Leg uit) knop heeft. Als je hierop klikt, schuift er een paneel open waarin de AI in simpele taal uitlegt *waarom* deze metric belangrijk is, en *hoe* de AI tot die data is gekomen. Ben je het eens met deze aanpak?

> [!IMPORTANT]
> **Multi-Company Opzet:** Om klaar te zijn voor je toekomstige e-commerce bedrijven, wil ik bovenaan het dashboard een "Company Switcher" (bedrijven-menu) maken. Zo kun je met 1 klik wisselen tussen de statistieken van *RebuildYourLife* en je toekomstige webshops.

## Proposed Changes

We gaan een compleet nieuwe sectie toevoegen in het project, gescheiden van de "War Room", maar wel verbonden met dezelfde data.

### 1. Route Structuur

#### [NEW] [page.tsx](file:///C:/Users/hseml/.gemini/antigravity/scratch/rebuildyourlife/apps/command-center/src/app/ceo/page.tsx)
- Een nieuw toegewezen route `/ceo` of `/admin`. 
- Dit wordt een strak, licht en "clean" design (in tegenstelling tot de donkere matrix-stijl van HQ). Het moet voelen als een high-end bedrijfsdashboard (zoals Stripe of Shopify, maar dan AI-gedreven).
- Bevat de `CompanySelector` voor het wisselen van bedrijf.

### 2. Componenten

#### [NEW] [CompanySelector.tsx](file:///C:/Users/hseml/.gemini/antigravity/scratch/rebuildyourlife/apps/command-center/src/components/ceo/CompanySelector.tsx)
- Een dropdown waarmee je het actieve bedrijf selecteert. 

#### [NEW] [BusinessMetrics.tsx](file:///C:/Users/hseml/.gemini/antigravity/scratch/rebuildyourlife/apps/command-center/src/components/ceo/BusinessMetrics.tsx)
- Grafieken (we gebruiken `recharts` voor mooie, interactieve grafieken) voor strategische groei, marketing prestaties en SEO verkeer.

#### [NEW] [FinancialHub.tsx](file:///C:/Users/hseml/.gemini/antigravity/scratch/rebuildyourlife/apps/command-center/src/components/ceo/FinancialHub.tsx)
- **Geautomatiseerde Boekhouding:** Een module voor naadloze integratie met boekhoudpakketten (geschikt voor MKB tot Grootbedrijf).
- **Cashflow & Risk Management:** AI-voorspellingen van uitgaven vs inkomsten.
- **Safety-Net Systeem:** De AI reserveert visueel automatisch belastingen en buffers, zodat je **nooit** achteruit gaat als je geld verdient. Het systeem slaat direct alarm als uitgaven niet in lijn lopen met groei.

#### [NEW] [AILearningPanel.tsx](file:///C:/Users/hseml/.gemini/antigravity/scratch/rebuildyourlife/apps/command-center/src/components/ceo/AILearningPanel.tsx)
- Dit is de "docent-laag" van de AI. Een zijpaneel (sidebar) dat openklapt wanneer je op "Uitleg" klikt bij een statistiek.
- De AI vertelt hier: "Ik heb gemerkt dat onze SEO daalde, dit komt doordat concurrent X een nieuw artikel heeft. Ik ben direct begonnen met het herschrijven van onze content. Dit is waarom ik dat besluit nam: [uitleg]."

### 3. Styling & Bibliotheken
- We zullen `recharts` toevoegen (`npm install recharts`) om professionele datagrafieken te bouwen.
- Het thema van dit dashboard wordt zeer professioneel: veel ruimte, overzicht, en makkelijk leesbare grafieken.

## Verification Plan

### Manual Verification
- We navigeren naar `/ceo`.
- Testen van de "Company Switcher" om te zien of de grafiek-data verandert.
- Klikken op de "Uitleg" knoppen om het AI Learning Panel te openen en de redenatie te lezen.
- Controleren of het design geschikt is voor een professionele bedrijfsvoering en jou als CEO optimaal inzicht geeft.
