# 🌍 Implementatieplan: Platform-Brede Vertaling & Language Switcher

Je hebt helemaal gelijk. Als het platform groeit, moet de taal naadloos kunnen meeschakelen met de gebruiker, maar voor jou en de eerste gebruikers in Nederland moet de voertaal 100% Nederlands zijn. 

Tot nu toe was de code deels in het Engels geschreven, en deels in het Nederlands (zoals de zojuist vertaalde God Mode). We gaan dit nu structureel oplossen.

## 1. De "i18n" Architectuur (Internationalization)
We gaan een volwaardig vertalings-systeem in de React code inbouwen. Dit betekent dat we nergens meer 'hardcoded' tekst in de pagina's zetten, maar werken met taal-woordenboeken (`nl.json` en `en.json`).
*   **Standaardtaal:** Nederlands (NL). Alles wat jij ziet en wat nieuwe gebruikers zien is direct in het Nederlands.
*   **Tweede taal:** Engels (EN), voor internationale schaalbaarheid.

## 2. De Language Switcher (De Knop)
In het hoofddashboard (`/dashboard` en `/admin`) plaatsen we rechtsboven of onderin de zijbalk een strakke, subtiele toggle-knop: **NL | EN**. 
*   Als een gebruiker hierop klikt, switcht het hele platform (menu's, knoppen, waarschuwingen) instantaan van taal, zonder de pagina te herladen.
*   De taalvoorkeur van de gebruiker slaan we op in hun account-instellingen in de database, zodat ze bij een volgende login direct hun eigen taal zien.

## 3. Wat moet er gebouwd worden?
1.  **Installatie & Configuratie:** We installeren een i18n bibliotheek (zoals `react-i18next` of Next.js ingebouwde i18n) in de codebase.
2.  **Taalbestanden (Dictionaries):** We creëren de mappen en bestanden waar alle vertalingen in komen te staan.
3.  **UI Component:** We bouwen de "Language Switcher" knop en integreren deze in de `Sidebar` en `Header`.
4.  **Refactoring:** Ik ga door de belangrijkste schermen heen (Dashboard, The Concierge, God Mode, Opportunities) om de Engelse teksten te vervangen door dynamische Nederlandse/Engelse vertaalsleutels.

---

## User Review Required

> [!WARNING]
> **Tijdsintensieve Refactor**
> Het opzetten van het systeem (de knop en de mappen) is relatief snel gedaan. Echter, het vervangen van álle teksten over het hele platform kost flink wat tijd. Ik zal beginnen met de core dashboards (God Mode, Concierge, Opportunity Engine) zodat we de basis hebben staan.
> 
> *Ga je akkoord met deze professionele aanpak voor de vertalingen? Klik op goedkeuren.*
