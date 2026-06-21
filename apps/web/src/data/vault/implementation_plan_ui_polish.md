# UI/UX Analyse & Polish Plan: The Grand Layout

Je hebt gelijk. Het systeem ziet er agressief en geavanceerd uit, maar een 'God Mode' interface moet niet alleen indrukwekkend zijn; het moet in één oogopslag moeiteloos leesbaar zijn. Een CEO tuurt niet naar kleine lettertjes.

Hier is mijn analyse van de huidige interface en het plan om dit op te lossen.

## 1. De Analyse (Wat er nu beter kan)

*   **Leesbaarheid (Contrast & Grootte):** We hebben veel "hacker" esthetiek gebruikt (kleine mono-letters, grijze tekst, hoge transparantie). Dit ziet er cool uit, maar vermoeit de ogen. De basis letters (het wit) moeten helderder (`text-white` i.p.v. `text-zinc-400`) en de standaard lettergrootte moet overal met 1 à 2 stappen omhoog (van `text-xs` naar `text-sm`, en `text-sm` naar `text-base`).
*   **Ruimtelijkheid (Ademruimte):** Je vroeg om het "uitgebreider" te maken. Momenteel zitten sommige blokken (zoals de Syndicate Logs of de Alpha Trading) dicht op elkaar gedrukt. We moeten de padding (binnenruimte) van de kaarten vergroten, zodat het systeem groter, luxer en rustiger aanvoelt.
*   **Structuur & Indeling:** De 3-kolommen layout in de War Room is perfect, maar de zijbalk (menu) en de globale headers kunnen robuuster. Het menu moet grotere letters krijgen. 

## 2. Het Actieplan (Proposed Changes)

Ik ga een globale "Polish Pass" uitvoeren over de belangrijkste schermen:

### [MODIFY] Globale Layout (`apps/web/src/app/dashboard/layout.tsx`)
*   Lettergrootte van de menuknoppen in de zijbalk vergroten (`text-sm` -> `text-base`).
*   De contrast-kleur van de inactieve tekst in het menu verhogen (van donkergrijs naar lichtgrijs) zodat het beter leesbaar is.

### [MODIFY] The War Room (`apps/web/src/app/dashboard/war-room/page.tsx`)
*   **Grotere Witte Tekst:** Alle grijze beschrijvingen worden helder wit. Alle data-labels worden 1 tot 2 stappen groter gemaakt.
*   **Ademruimte:** De padding rondom de kaarten (Live Inkomsten, Radar, Syndicate Logs) wordt vergroot van `p-6` naar `p-8` of `p-10`. Dit maakt de blokken breder en weidser.
*   **Duidelijkere Waardes:** De grote winstcijfers (`text-6xl`) blijven gigantisch, maar de sub-cijfers (bijv. +1.24%) worden aanzienlijk groter en vetter gemaakt.

### [MODIFY] The Neural Link Orb (`apps/web/src/components/OrionNeuralLink.tsx`)
*   De tekst in het chatvenster van Orion is nu vrij klein (`text-sm` font-mono). Dit schaal ik op zodat de gesprekken makkelijker te lezen zijn, zonder dat we inleveren op de strakke AI-look.

---

> [!IMPORTANT]
> **User Review Required**
> Dit plan focust zich 100% op de leesbaarheid, luxe en overzichtelijkheid. Als we dit doorvoeren, worden alle letters groter, witter en krijgt de layout meer ademruimte.
> 
> Klik op **Proceed**, dan open ik de code en pomp ik de schaalbaarheid overal omhoog.
