# 💻 HARDWARE PROTOCOL: THE KIOSK LAPTOP

Jouw doel is om een laptop af te leveren (aan familie of €5K+ klanten) die voelt alsof hij draait op het **RebuildYourLife OS**. Ze mogen geen spatje van Windows zien. Geen startknop, geen taakbalk, geen bureaublad. Ze klappen het scherm open en ze zitten in de Godbrain.

Dit is 100% mogelijk. In de IT noemen we dit "Assigned Access" of **Kiosk Modus**. Hier is precies hoe je die laptops straks configureert voordat je ze weggeeft:

## Stap 1: Windows Kiosk Modus Instellen (Single-App Mode)
In plaats van een normale gebruiker aan te maken, maak je in Windows een "Kiosk" account aan.
1. Ga in Windows naar **Instellingen > Accounts > Gezin en andere gebruikers**.
2. Klik onder *Kiosk instellen* op **Toegewezen toegang (Assigned Access)**.
3. Kies de Microsoft Edge browser als de enige toegestane applicatie.

## Stap 2: De Browser Vergrendelen (Digital Signage Mode)
Je stelt de Kiosk zo in dat de browser full-screen opent op de URL van jouw platform (bijvoorbeeld `https://app.rebuildyourlife.com`).
*   De browser heeft géén adresbalk.
*   De browser heeft géén terug/vooruit knoppen.
*   **Resultaat:** Jouw web-applicatie *is* het besturingssysteem geworden.

## Stap 3: Hardware Lock-down
Wanneer de Kiosk Modus draait, blokkeert Windows automatisch de toetsenbordsneltoetsen:
*   `Alt + Tab` doet niets.
*   De `Windows Toets` doet niets.
*   `Ctrl + Alt + Delete` is afgeschermd.
Ze kunnen de applicatie letterlijk niet verlaten. Ze zitten vast in jouw ecosysteem.

## Stap 4: Auto-Boot (Openklappen = Aan)
In de BIOS van de laptop stel je in: "Power on when lid is opened" (Aanzetten zodra scherm openklapt). Combineer dit met Windows Auto-Login voor het Kiosk-account.

**De Ervaring voor de Klant:**
Ze krijgen een strakke, zwarte laptop van jou. Ze klappen het scherm open. Het duurt 5 seconden... en BAM. Geen Windows logo, geen wachtwoorden. Direct die massieve, hyper-realistische 4D Godbrain interface voor hun neus.
