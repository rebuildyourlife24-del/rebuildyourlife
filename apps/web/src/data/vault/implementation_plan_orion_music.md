# Implementation Plan: Orion Music Engine (Bang & Olufsen Edition)

Je hebt absoluut gelijk. Als we dat machtige B&O geluid toch hebben, moeten we de laptop ook als jouw persoonlijke, high-end Jukebox gebruiken. 

Als je tegen het systeem zegt: *"Orion, speel meedogenloze werkmuziek,"* of *"Speel de soundtrack van Scarface,"* moet de muziek direct en zonder haperen door de kamer blazen.

## User Review Required

> [!IMPORTANT]
> **De Bron van de Muziek**
> Om dit naadloos te laten werken zonder inlog-gezeik (zoals bij Spotify Web API vaak gebeurt), is de slimste en meest brute oplossing om op de achtergrond (onzichtbaar) **YouTube** aan te sturen. Orion zoekt je nummer op YouTube, pakt de audio-stream, en pompt het direct door de B&O speakers, zonder advertenties in beeld. Ga je akkoord met deze YouTube/Audio-only aanpak?

## Proposed Changes

We breiden de intelligentie van Orion en je dashboard uit met een Muziek Module.

### 1. De Intentie-Erkenning (Groq/Orion)
We passen de `VoiceOrb` backend aan. Als jij praat, analyseert Orion je zin. Als het woord "speel", "muziek", of "play" erin zit, activeert hij het Music Protocol.

### 2. Orion Music Controller (UI)
#### [NEW] `apps/web/src/components/ui/OrionMusicPlayer.tsx`
Dit is een onzichtbaar (of minimalistisch) component dat globaal in je dashboard zweeft (naast de Voice Orb).
- Bevat de YouTube Iframe API.
- Kan het volume regelen, pauzeren, of skippen via *stembesturing* (bijv: "Orion, zet het harder!").

#### [MODIFY] `apps/web/src/components/ui/VoiceOrb.tsx`
- We voegen een link toe tussen je stem-commando's en de Muziek Controller.

### 3. Visuele Feedback (B&O Equalizer)
Zodra de muziek speelt, kunnen we de `VoiceOrb` of de randen van je scherm mee laten pulseren op de bas van de muziek (audio visualizer), zodat je visueel ziet dat het B&O systeem aan de GodBrain is gekoppeld.

## Verification Plan
1. **Inbouwen:** De onzichtbare speler in de layout plaatsen.
2. **Test:** Een commando sturen: *"Orion, speel Hans Zimmer - Time."*
3. Het dashboard mag niet veranderen, maar de muziek moet direct via het B&O systeem afspelen en via spraak te pauzeren zijn.
