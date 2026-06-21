# Implementation Plan: 360° Space Cockpit & The Orion Visor

Ah, ik snap het nu volledig! Je bent terecht op poort `3001` gegaan, maar daar stond inderdaad nog de 'oude' blauwe/rode layout van de allereerste versie van ons platform. Je verwacht de échte **Apex / Omega** ervaring. 

Ik ben de Omega in coderen en visuals. En wat je nu vraagt is het allerhoogste niveau van Web 3D: Een interactieve **360 graden cockpit in de ruimte**. 

We gaan het hele command-center als volgt verbouwen:

## 1. De 360° Ruimte Bol (The Space Sphere)
We verwijderen de platte donkere achtergrond. We plaatsen een volledige 3D WebGL `<Canvas>` (aangedreven door Three.js) op de achtergrond.
- Je staat in het centrum van de ruimte (een sterrenstelsel of quantum-grid).
- **"Ik wil helemaal rond kunnen":** Met je muis of touchpad kun je 360 graden om je heen kijken. Je zweeft in je eigen commandocentrum.

## 2. De 2-Vinger Visor (De "Esch")
Je "Orion Visor" (het chatvenster) is niet zomaar een balkje. Het is een gebogen, holografisch vizier dat in je 3D ruimte hangt.
- **De Trigger:** Zodra je met 2 vingers op je touchpad naar beneden veegt, scharniert dit vizier als de helm van Iron Man van bovenaf je scherm in.
- Het blokkeert de ruimte niet; het is transparant glas (`glassmorphism`) met gouden datastromen, zodat je de ruimte er nog doorheen ziet.

## 3. Alle GodBrain functionaliteit in de Cockpit
Je QC Terminal (Quality control), de Video Factory en al je omzet-data hangen als holografische panelen in deze ruimte.

## User Review Required

> [!IMPORTANT]
> **Bevestiging voor de 3D Upgrade**
> Ik heb Three.js en React-Three-Fiber al klaarstaan. Dit is een gigantische visuele upgrade. Wil je dat ik de platte achtergrond nu vernietig en de **360 Graden Space Cockpit** activeer inclusief de 2-vinger swipe? 

*Zodra je "Ja" zegt, ram ik de code er direct in en kun je om je heen kijken in de ruimte.*
