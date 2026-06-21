# Implementation Plan: J.A.R.V.I.S. Voice Link (Open Connectie)

Je wilt de ultieme CEO-ervaring: zodra je de ASUS openklapt, staat er een open audio-verbinding. Je hoeft niet te typen, je **praat** gewoon tegen het systeem, en het systeem praat terug. Net als Tony Stark met J.A.R.V.I.S.

Dit is technisch haalbaar door een onzichtbare "Voice Layer" over je hele dashboard te leggen.

## User Review Required

> [!IMPORTANT]
> **De Stem van het Systeem**
> Om dit "op miljarden niveau" te doen, gebruiken we **ElevenLabs** voor de stem. Dit is de meest realistische AI-stem ter wereld (geen robot-stem, maar een echte assistent met emotie en ademhaling). 
> *Wil je een strikte, formele Britse butler stem (zoals J.A.R.V.I.S.), of een vlotte, strategische vrouwelijke/mannelijke zakenpartner stem?*

## Open Questions

> [!WARNING]
> **Afluister-Gevaar (Microfoon)**
> Als de microfoon "altijd aan" staat zodra de laptop open is, luistert hij naar álles. Wil je een "Wakeword" (bijv. dat je eerst "Hé GodBrain" of "Computer" moet zeggen voordat hij reageert), of wil je een grote fysieke knop op je scherm (Push-to-Talk) die je indrukt als je een commando geeft?

## Proposed Changes

We bouwen een globale audio-verbinding in de web-applicatie die altijd meedraait op de achtergrond.

### 1. De Audio Engine (Frontend)
We passen het fundament van je dashboard aan zodat de microfoon direct opstart.

#### [MODIFY] `apps/web/src/app/layout.tsx`
- We injecteren een `<VoiceConnectionProvider />` die de WebRTC microfoon stream beheert.
- We voegen VAD (Voice Activity Detection) toe. Zodra je stopt met praten, knipt hij de audio af en stuurt hij het razendsnel naar de server.

### 2. De Verwerkingslijn (Backend API)
We gebruiken de absolute top-tier API's voor bliksemsnelle audio-verwerking.

#### [NEW] `apps/web/src/app/api/voice/route.ts`
Deze route doet het volgende binnen milliseconden:
1. **Oren (Whisper API via Groq):** Zet jouw gesproken stem om naar tekst.
2. **Brein (Llama-3 via Groq):** Bedenkt direct het antwoord of voert je taak uit in het dashboard.
3. **Mond (ElevenLabs API):** Genereert de MP3 van de stem die direct via WebSockets naar je speakers wordt gestreamd.

### 3. De Visuele Feedback (UI)
Zelfs al praat je, je moet kunnen zien dat de AI luistert.

#### [NEW] `apps/web/src/components/ui/VoiceOrb.tsx`
Een minimalistische, gloeiende bol (passend bij je nieuwe Transcendente Logo) onderaan in je dashboard.
- **Pulseert zachtjes:** Als hij luistert.
- **Knippert snel:** Als hij aan het nadenken is.
- **Straalt fel:** Als hij tegen je terugpraat.

## Verification Plan

### Automated Tests
- Testen van de VAD (Voice Activity Detection) om te zorgen dat achtergrondgeluid (zoals auto's buiten) genegeerd wordt en hij alleen op jouw stem reageert.

### Manual Verification
- Je klapt de laptop open. Het systeem zegt: *"Welcome back, Sir. De Video Factory draait op 100% en er is zojuist €40 verdiend. Wat zijn uw orders?"*
- Jij zegt: *"Breng de nachtploeg online en verplaats het budget."* En het systeem voert het direct uit in de code.
