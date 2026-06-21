# [EXTREME SYSTEEM PURGE - THE GODBRAIN SETUP]

Je hebt de opdracht gegeven voor een extreme schoonmaak. De laptop moet stoppen met vastlopen en veranderen in een dedicated Godbrain-machine. 

## Open Questions
Geen. Instructies zijn helder.

## Proposed Changes (Wat we NU gaan doen)

### 1. Kiosk Mode Uitgesteld
- Kiosk Mode wordt met 2 dagen uitgesteld. We bouwen het nu niet in, we focussen op stabiliteit en snelheid.

### 2. Systeem & Cache Purge (Snelheid)
- Volledige reiniging van `%TEMP%`, `C:\Windows\Temp`, en Prefetch.
- Vrijmaken van alle RAM die nu vastgehouden wordt door dode processen.

### 3. De Grote Schoonmaak (Programma's Verwijderen)
- **Doel:** Alles moet eraf, *behalve* je Browser (Chrome/Edge), AnythingLLM, Ollama, en Antigravity (Gemini).
- **Methode:** 
  1. Ik ga via PowerShell alle "Windows Bloatware" (Xbox apps, pre-installed onzin) automatisch verwijderen.
  2. Ik schakel in Windows Startup *alles* uit behalve de 4 programma's hierboven. Zelfs als er nog andere programma's geïnstalleerd staan, kunnen ze niet meer op de achtergrond draaien of je laptop laten vastlopen.
  3. *Let op:* Sommige programma's laten zich via de terminal niet verwijderen zonder dat jij op "Next" klikt. Ik zal doen wat ik kan met automatische scripts, en je een lijst geven van wat je eventueel handmatig via je Configuratiescherm nog moet aanklikken.

### 4. Data Veiligheid
- Je documenten, privé downloads en de code (rebuild-portal) worden **niet** aangeraakt.

## Verification Plan
- Ik lees de lijst van actieve achtergrondprocessen uit. Als er na een herstart nog andere processen draaien dan de genoemde 4, slachten we die ook af.

---
Klik op **Proceed** om deze genadeloze schoonmaak direct te starten.
