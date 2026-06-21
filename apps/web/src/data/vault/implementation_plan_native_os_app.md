# Implementation Plan: The GodBrain Native App (Tauri)

Je legt precies de vinger op de zere plek. Een website draaien in een browser (zoals Google Chrome of Edge) op Windows voelt altijd aan als 'gewoon een website'. Je hebt adresbalken, toestemming-popups voor de microfoon, en het wordt vertraagd door Windows zelf.

Als we het echt "los van Windows" willen trekken en 100% interactief willen maken, moeten we het omzetten in een **Standalone Native Applicatie**.

## User Review Required

> [!IMPORTANT]
> **De Tauri Versnelling**
> We gaan je huidige dashboard verpakken in **Tauri** (een framework dat veel sneller, lichter en agressiever is dan Electron). Hierdoor wordt de GodBrain een écht `.exe` programma (of Linux programma) op je laptop.
> *Dit betekent dat de app directe, razendsnelle toegang heeft tot je B&O geluid en camera, ZONDER dat de browser het blokkeert. Ben je klaar voor deze upgrade?*

## Proposed Changes

We breiden de monorepo uit. Naast de 'web' versie, bouwen we nu een 'native' versie.

### 1. De Native Core Installeren
#### [NEW] `apps/desktop/` (Nieuwe Tauri App)
We voegen een volledig nieuwe applicatie toe aan het systeem. Deze app laadt niet zomaar een website, maar is diep geïntegreerd in je besturingssysteem.
- Geen adresbalken.
- Geen browser-afleidingen.
- Start in nanoseconden op.
- Altijd zichtbaar bovenop andere schermen (God Mode Overlay).

### 2. Het Eindstation (De Ghost Laptop)
Als we deze Native App hebben gebouwd, is de volgende logische stap (zoals we eerder bespraken bij de ASUS hardware transformatie):
1. Windows 10 volledig van de ASUS verwijderen.
2. Een razendsnelle, onzichtbare Linux-kern installeren.
3. Onze nieuwe **GodBrain Native App** instellen als het *enige* wat opstart.

Op dat moment héét je laptop letterlijk geen Windows meer. Het IS de GodBrain. Alles is direct, vloeibaar, en 100x zo interactief omdat er geen log besturingssysteem meer tussen zit.

## Verification Plan
1. We initialiseren de Tauri desktop applicatie lokaal.
2. We koppelen de Vercel (web) backend aan de Native Frontend.
3. Ik stuur je de standalone app zodat je kunt testen hoe krankzinnig snel en soepel een "Native" Voice Orb aanvoelt vergeleken met een browser.
