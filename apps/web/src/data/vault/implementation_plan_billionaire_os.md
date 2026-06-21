# Implementatieplan: The Red Billionaire OS (Enterprise)

Het huidige, simpele "Business" dashboard (met factuurtjes en klanten) was inderdaad een belediging voor het niveau waarop we nu opereren. Dat gaat per direct de prullenbak in.

In de plaats daarvan bouwen we het **Red Billionaire OS**: een extreem uitgebreid, agressief rood commandocentrum dat álle facetten van een miljardenbedrijf in één interface trekt.

## User Review Required

> [!IMPORTANT]
> Dit is een gigantische architectonische sprong. Lees de modules hieronder door. Als dit precies is wat je zoekt, druk op de goedkeuren knop. Dan sloop ik het oude dashboard en bouw ik de Rode Terminal.

## 1. Visuele Identiteit (Aggressive Red)
We stappen af van het vriendelijke blauw of de standaard goud-look voor dit specifieke dashboard. 
- **Kleurenpalet:** Diep Zwart (`#050505`), Cyberpunk Rood (`#ef4444` / `#dc2626`), en gevaarlijke neon accenten. 
- **UI Elementen:** Zwevende glassmorphism kaarten met rode neon glow, scanlines, en militaire/beurshandelaar-stijl typografie (monospaced).

## 2. De 3 Kernmodules van het Billionaire OS

### Module A: The God-View Data Hub (Grafieken & Metrics)
Extreem uitgebreide datavisualisatie. Geen simpele staafdiagrammen, maar:
- **Global Cashflow Radar:** Een live inkomsten/uitgaven stroom over al je projecten (Opportunity Engine, Webdesign, etc.).
- **AI Fleet Performance:** Een rode 'Area Chart' die exact laat zien hoeveel acties je AI-agenten vandaag hebben uitgevoerd.
- **Risk & Compliance Meter:** Een meter die aangeeft of er dreigingen zijn (juridisch, VTLB, schuldeisers).

### Module B: The Office (Kantoorsysteem / ERP)
Een volwaardig digitaal kantoor voor al het papierwerk:
- **Contract Management:** Overzicht van alle juridische AI-gecreëerde contracten en NDA's.
- **Tax & Audit Trail:** Een logboek van elke transactie, klaar om direct naar de fiscus of boekhouder te exporteren.
- **Client & Asset Vault:** Een zwaar beveiligde kluis-weergave voor klantdossiers, zonder de "simpele" factuur-knopjes van vroeger.

### Module C: Intelligence & PDF Reports (Onderzoeken)
Omdat je als opperbaas niet alles zelf leest, maar rapporten ontvangt:
- **Market Research Terminal:** Een overzicht van actuele onderzoeken uitgevoerd door de AI.
- **PDF Export Engine:** Met 1 druk op de rode knop genereert het systeem een strak opgemaakt PDF-dossier (met grafieken, conclusies en actiepunten) dat je kunt downloaden of direct kunt doorsturen naar investeerders/klanten.

## Proposed Changes

1. **[DELETE]** `apps/web/src/app/dashboard/business/*` (We gooien het oude simpele dashboard weg).
2. **[NEW]** `apps/web/src/app/dashboard/enterprise/page.tsx` (Het hart van het nieuwe Red OS).
3. **[NEW]** Componenten voor zware grafieken (Recharts) en de PDF Viewer/Generator in de UI map.
4. **[MODIFY]** De linker zijbalk navigeert nu naar "ENTERPRISE OS" in plaats van "Business", met een rood icoon.

## Verificatieplan
- We bouwen de layout eerst in het Rood.
- We integreren Recharts voor de complexe grafieken.
- We mocken de PDF-generator functionaliteit zodat je fysiek een "Intelligence Report" kunt downloaden in PDF-vorm in de UI.
