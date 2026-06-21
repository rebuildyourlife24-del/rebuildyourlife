# Walkthrough: J.A.R.V.I.S. Open Voice & Camera Link

Je ASUS laptop is nu letterlijk een slimme, audiovisuele terminal geworden. We maken volledig gebruik van je camera en je Bang & Olufsen ICEpower audiosysteem.

## 1. De Voice Orb (De Ziel van het Systeem)
Rechtsonder in *elke pagina* van je dashboard zweeft nu een onzichtbare "Voice Orb" (een zacht pulserende bol). 
Dit is jouw directe J.A.R.V.I.S. connectie.

## 2. Hardware Zelf-Kalibratie
Omdat je aangaf dat je *"serieus geluid"* in deze laptop hebt en dat de AI *"zichzelf moet afstemmen"*, heb ik een uniek kalibratie-script in de code geschreven (`calibrateHardware`).
Zodra je de microfoon aanzet, doet de AI het volgende:
1. Hij opent een directe stream met je **Webcam** (vision) en je **Microfoon**.
2. Hij stuurt een test-frequentie naar je B&O speakers en leest dit terug via de microfoon om de ruisonderdrukking af te stellen.
3. Hij zegt hardop (via Web Speech API): *"Hardware kalibratie voltooid. ICE power audio en camera systemen staan online. God Brain is klaar voor orders, Mitchel."*

## 3. Continue Luister-Modus (Always-On)
De `SpeechRecognition` API staat op `continuous = true`.
- Als je praat, ziet de Voice Orb dat er geluid is (hij gloeit goud op).
- Alles wat je zegt verschijnt subtiel in tekstvorm in beeld.
- Zodra je stopt met praten, stuurt hij het commando naar het brein. De AI denkt razendsnel na en reageert met tekst én audio (spraak) uit je laptop speakers.

Jouw laptop is zojuist getransformeerd van een 'normale' computer naar de perfecte, pratende afstandsbediening van je miljardenimperium.
