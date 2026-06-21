## Doelstellingen volgens het Bedrijfsplan
1. **Publieke SaaS (`rebuildyourlife.eu`)**: Klantgerichte voorkant (nog apart te ontwikkelen of te koppelen).
2. **Command Center (Vercel)**: De afgeschermde achterkant waar de eigenaar inlogt.
3. **Data Lagen & Transparantie**: Het is cruciaal dat álle informatie die een specifieke Agent binnenhaalt (leads, zoektermen, financiën) in een zichtbare, gelaagde structuur te bekijken is. Geen "zwarte doos", maar rauwe data die in te zien is.
4. **SEO & CEO Dashboard**: Grafische weergave van bedrijfsdata, gesplitst per dag, week, maand, kwartaal, halfjaar en jaar.
5. **Master AI Orchestrator**: Één centrale AI die alle onderliggende agenten aanstuurt en hun data samenvat.

## User Review Required
> [!IMPORTANT]
> Beoordeel of deze datastructuur en grafiek-indeling exact is wat je bedoelt met de samenvatting per dag/week/maand/kwartaal. Zodra je akkoord geeft, bouw ik dit direct in de code.

## Proposed Changes

### 1. Database & Aggregatie API
We moeten endpoints maken die de ruwe data uit de database ophalen en groeperen op tijdlijnen, zodat de grafieken dit kunnen lezen.

#### [NEW] `apps/command-center/src/app/api/metrics/route.ts`
- Een API-route die alle financiële, SEO- en gebruikersdata ophaalt.
- Bevat logica om de data te groeperen per: `DAY`, `WEEK`, `MONTH`, `QUARTER`, `YEAR`.
- Controleert of de gebruiker de rol `SUPREME_OVERSEER` heeft.

### 2. CEO Data Dashboard (UI & Grafieken)
We bouwen een nieuwe module binnen het Command Center, specifiek voor de CEO-grafieken.

#### [NEW] `apps/command-center/src/components/CEODashboard.tsx`
- Implementatie van geavanceerde datavisualisatie (Recharts of Chart.js).
- Tabs om te schakelen tussen tijdsperiodes: **Dag | Week | Maand | Kwartaal | Jaar**.
- Weergave van KPIs: Actieve gebruikers (SaaS), MRR (Monthly Recurring Revenue), SEO-score, Scraper-leads.

#### [MODIFY] `apps/command-center/src/app/hq/page.tsx`
- Integratie van het `CEODashboard` component in de War Room.
- Toevoegen van een "Data Feed" weergave per agent. Als je op een agent klikt (bijv. de Scraper), schuift er een paneel open met de *exacte* informatie die hij heeft binnengehaald (bijv. een tabel met Leads, e-mails, en statussen).

### 3. Agent Data Lagen (De Diepte In)
We bouwen voor de 3 belangrijkste agenten een specifieke data-laag in het Command Center, zodat je eindelijk ziet wat ze doen:
- **Scraper & Leads Laag:** Een tabelweergave van gevonden prospects (Bedrijfsnaam, Website, E-mail, Score).
- **SEO & Marketing Laag:** Een overzicht van geanalyseerde zoektermen en concurrentie-metrics.
- **Financiën Laag:** Een directe weergave van actuele inkomsten, uitgaven en Stripe-events.

### 4. Master AI Orchestrator (Orion)
De AI moet niet alleen reageren, maar proactief data samenvatten uit de grafieken en de agenten aansturen.

#### [MODIFY] `apps/command-center/src/hooks/useProactiveEngine.ts`
- De engine uitbreiden zodat hij autonoom het `metrics` endpoint uitleest.
- Als er een daling is in de wekelijkse of kwartaalcijfers, genereert Orion autonoom een actieplan en stuurt de SEO- of Scraper-agent aan.

## Verification Plan
### Automated Tests
- Testen of de `/api/metrics` route correct weigert bij niet-CEO's.
- Valideren dat de datagroepering per kwartaal wiskundig klopt.

### Manual Verification
- Inloggen in de Vercel-omgeving als admin.
- Controleren of het dashboard netjes schakelt tussen Dag, Maand en Kwartaal weergaves.
- Verifiëren of de AI een samenvatting kan geven van een specifiek kwartaal.
