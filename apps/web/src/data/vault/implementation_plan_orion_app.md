# Orion V1 - Autonomous Desktop App

We bouwen een onafhankelijke desktop applicatie voor Orion V1. Hij draait 100% lokaal via Ollama met een eigen SQLite geheugen, maar krijgt de mogelijkheid om **zelfstandig het internet op te gaan** en acties uit te voeren.

## User Review Required

> [!IMPORTANT]
> **Veiligheid & Autonomie:** Ik geef Orion de mogelijkheid om zelfstandig Python scripts uit te voeren om het internet op te gaan (bijv. webpagina's scrapen, netwerk scans uitvoeren). Ga je hiermee akkoord? Dit geeft hem de hacker-vrijheid die je vroeg, maar betekent ook dat hij code uitvoert op jouw machine.

> [!WARNING]
> **Design Keuze:** We gebruiken `pywebview` om een snelle, native desktop app te maken met een donkere, holografische hacker-interface (HTML/CSS/JS). Dit is lichter en sneller dan een heel Electron framework.

## Open Questions

1. Wil je dat Orion's internet-toegang beperkt is tot zoeken/lezen, of mag hij ook data verzenden (bijv. inloggen op websites, API's aanspreken)?
2. Wil je de app fullscreen (zoals het commandocentrum) of als een zwevend venster dat je altijd op de achtergrond open kunt houden?

## Proposed Changes

### 1. Backend Core (`orion_core_app.py`)
- Python server gebaseerd op de eerdere `orion_offline.py`.
- **Nieuw:** Integratie van "Tool Calling" (Functies die Orion zelf kan aanroepen).
- Functies: `check_network_status()`, `fetch_webpage(url)`, `execute_network_scan(target)`.

### 2. Frontend App (`app_ui.html`)
- Een ultra-moderne, kille hacker UI.
- Zwarte achtergrond met cyaan/groene datastromen.
- Live weergave van Orion's "hersens" (laat zien of hij lokaal denkt of het internet op is).

### 3. Launcher (`start_orion.bat`)
- Een simpele executable/batch file om de desktop app met 1 klik te starten.

## Verification Plan

### Manual Verification
- We starten de app en vragen Orion om live nieuws of een website samen te vatten. Als hij dit kan terwijl zijn core lokaal draait, is de autonome verbinding succesvol.
- We testen of het geheugen (SQLite) tussen app-sessies bewaard blijft.
