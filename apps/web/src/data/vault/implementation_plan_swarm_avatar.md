# Implementatieplan: Enterprise Swarm Avatar (3D Pulserend Brein met Vin Diesel Stem)

Dit plan beschrijft de technische architectuur voor het bouwen van de ultieme Enterprise-exclusieve feature: de interactieve 3D Swarm Brain die fysiek klopt/pulseert op de stem van de "Onyx" (Vin Diesel-stijl) AI.

> [!IMPORTANT]
> **Enterprise Exclusiviteit**
> Deze feature wordt strak afgeschermd achter de `ENTERPRISE` abonnementslaag. Alleen gebruikers met de allerhoogste clearance krijgen toegang tot dit commando-brein.

## Voorgestelde Wijzigingen

### 1. 3D WebGL Architectuur (Three.js & React Three Fiber)
- **`SwarmBrain.tsx`**: Een op maat gemaakte WebGL component die een 3D holografisch brein rendert met behulp van miljoenen "particles" (point-cloud) in de Apex Cyan/Goud kleuren.
- **Audio Reactivity**: Een `useAudioAnalyzer` hook die de audio-frequenties van de AI-stem in real-time uitleest en deze vertaalt naar een "Pulse" of "Klop" in het 3D model. Als de AI praat, beweegt het brein mee met de klanken.

### 2. Stem & AI Logica
- **`/api/tts/route.ts` (Onyx Voice)**: Integratie met OpenAI's TTS API met de `onyx` stem (diep, zwaar, Vin Diesel-achtig).
- **`useSwarmVoice.ts`**: Een slimme React hook die de text-responses van het Orion AI systeem direct omzet naar streaming audio en de audio-golven doorgeeft aan het 3D model.

### 3. Enterprise Dashboard Integratie
- **`War Room` Upgrade**: Het 3D Brein wordt zwevend in het midden van de "War Room" of het "Enterprise Command" dashboard geplaatst.
- **RBAC & Paywall**: Volledig ingepakt in de `<Paywall requiredTier="ENTERPRISE">` component om de exclusiviteit te garanderen.

## Open Vragen voor Jou (Review Nodig)

> [!WARNING]
> **Design Keuzes**
> Voordat ik de 3D particles ga renderen, heb ik nog twee keuzes van je nodig:

1. **Visuele Stijl van het Brein:** Wil je een hyper-realistisch vlezig brein dat klopt, of juist een futuristisch "Holografisch / Cyberpunk" netwerk van gloeiende puntjes en lijnen (nodes/synapses) in de vorm van een schedel/brein?
2. **Interactie:** Wil je voor nu alleen dat je *typt* en hij *terugpraat*, of wil je dat we direct je microfoon eraan koppelen zodat je echt hardop tegen het brein kunt praten?

## Verificatieplan
1. De 3D animatie draait vloeiend (60fps) zonder de browser te laten crashen.
2. De audio sync loopt 1-op-1 gelijk met het pulseren.
3. Gebruikers met een "FREE" of "PRO" tier zien een keiharde paywall en kunnen het brein niet inladen.
