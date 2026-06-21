# Goal Description

De gebruiker heeft aangegeven dat de "Zen/Lichte" modus niet de bedoeling is. In plaats daarvan moeten we terug naar de afgesproken premium stijl (Nachtblauw & Goud), maar de huidige uitvoering op de website is nog te onrustig (door o.a. felblauwe/neon effecten). Daarnaast moet de inlogpagina van Orion compleet geminimaliseerd worden.

## Proposed Changes

### 1. Orion Login Pagina (ai-henksemler.nl)
Wordt volledig gestript van onnodige styling en animaties. 
- **[MODIFY] `apps/command-center/src/app/page.tsx`**
- Achtergrond: Effen donkerblauw/zwart (`#0a0e1a`).
- Geen gradients, geen glowing effecten.
- Alleen een clean logo, een strak invoerveld voor het wachtwoord en een knop.

### 2. Verkooppagina Klantenwebsite (rebuildyourlife.eu)
De pagina wordt teruggebracht naar de afgesproken premium huisstijl (Nachtblauw & Goud), zonder afleidende tech-elementen.
- **[MODIFY] `apps/web/src/app/page.tsx`**
- Verwijder de "neon" / cyan / felblauwe achtergrondgloed en matrix-achtergronden.
- Gebruik uitsluitend de afgesproken kleuren: `navy` (#0a0e1a) en `gold` (#d4a853).
- Zorg voor een overzichtelijke, rustige opmaak met veel ruimte tussen de secties.
- Maak de sectie met de abonnementen (Prijzen) uiterst helder en dominant als een echte sales page.

---

## Verification Plan

1. Aanpassen van `apps/command-center/src/app/page.tsx`.
2. Aanpassen van `apps/web/src/app/page.tsx`.
3. Lokaal bouwen en verifiëren dat alle neon-elementen verdwenen zijn.
4. Screenshots tonen aan de gebruiker ter goedkeuring.
