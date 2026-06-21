# Master Plan: Orion Sentience Protocol (Real-Life J.A.R.V.I.S.)

Dit document beschrijft de technische architectuur om Orion te transformeren van een chat-bot in je dashboard naar een 100% spraakgestuurde, fysiek klinkende AI-assistent (J.A.R.V.I.S. / F.R.I.D.A.Y. equivalent) die de Godbrain applicatie kan besturen.

## 1. De Technologie Stack (De Componenten)

Om een miljardairs-waardige voice-assistant te bouwen, hebben we de zwaarste API's nodig op het gebied van audio-verwerking:

*   **Het Oor (Speech-to-Text):** `OpenAI Whisper API`. Dit is veruit de snelste en meest accurate stemherkenner ter wereld. Het verstaat Nederlands en Engels feilloos door elkaar heen.
*   **Het Brein (LLM & Function Calling):** `OpenAI GPT-4o`. De "o" staat voor omni, wat betekent dat het extreem snel is. We koppelen dit aan "Function Calling", zodat Orion niet alleen tekst teruggeeft, maar daadwerkelijk acties in je applicatie kan uitvoeren (zoals het openen van de War Room of het starten van een simulatie).
*   **De Stem (Text-to-Speech):** `ElevenLabs API`. We gaan geen robot-stemmetje van Google gebruiken. ElevenLabs levert ultra-realistische, emotionele stemmen. We selecteren een diepe, Britse of zware sci-fi stem die "Orion" wordt.

## 2. De Frontend Integratie (Jouw Scherm)

We bouwen deze intelligentie direct in de **Orion Neural Link Orb** (die nu rechtsonder op je scherm staat). 

### [MODIFY] `apps/web/src/components/OrionNeuralLink.tsx`
We voegen geavanceerde audio-processing toe aan deze component:
*   **Microfoon Access:** Zodra je het systeem aanzet, vraagt de browser toegang tot je microfoon.
*   **Audio Visualizer:** De kloppende Orb verandert in een equalizer (streepjes die meebewegen met jouw stem) zodra je begint met praten.
*   **Audio Weergave:** De browser speelt de ElevenLabs stem direct af, synchroon met de flitsende beelden van de Orb.

## 3. De Backend Integratie (De Servers)

### [NEW] `apps/api/src/routes/voice.ts`
We bouwen een nieuwe server-route speciaal voor audio. Omdat we audio via internet moeten sturen, moet dit extreem geoptimaliseerd zijn om vertraging (latency) te voorkomen.
1. Jouw browser streamt audio naar de Godbrain backend.
2. De backend transcribeert dit via Whisper.
3. De backend bedenkt een actie of antwoord.
4. De backend genereert de stem via ElevenLabs en streamt de .mp3 direct terug naar je speakers.

---

> [!IMPORTANT]
> **User Review Required**
> Deze architectuur is het absolute eindniveau van besturing. Als we dit goed uitvoeren, heb je een systeem dat je letterlijk met je stem kunt commanderen, zoals in de YouTube video die je stuurde.
> 
> *Klik op **Proceed** om dit Masterplan officieel toe te voegen aan onze actielijst voor het einde van deze week.*
