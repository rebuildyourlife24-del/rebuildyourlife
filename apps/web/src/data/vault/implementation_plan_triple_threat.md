# ⚡ THE TRIPLE THREAT: MASTER IMPLEMENTATION PLAN

We gaan op 3 fronten tegelijkertijd bouwen. Dit is het masterplan om de financiën strak te trekken, de gebruikers op te leiden, en de instroom van klanten te automatiseren.

## Deel 1: The Apex Ledger (War Room Financials)
*Status: Het kloppende hart van je imperium.*
We gaan de Red War Room vullen met echte data-widgets.
*   **Doelwit:** We bouwen het `FinancialDashboard` component in `/war-room`.
*   **Functies:**
    *   Live Profit & Loss (inkomsten webshops vs. payouts van de Opportunity Engine).
    *   Schatkist/Treasury Vault overzicht (hoeveel kapitaal we hebben om assets te kopen).
    *   Syndicate Capital Pool (gecombineerd kapitaal).

## Deel 2: The Academy (Kennis & Training)
*Status: De machinekamer voor je community.*
We moeten zorgen dat gebruikers weten *hoe* ze hun leven moeten herbouwen en *hoe* ze taken moeten uitvoeren.
*   **Doelwit:** Een nieuwe route: `/dashboard/academy`.
*   **Database Architectuur:** We moeten `Course`, `Lesson`, en `UserProgress` toevoegen aan de Prisma Database, zodat we kunnen bijhouden wie welke training heeft afgerond.
*   **Functies:** Videomodules of tekstlessen (bijv. "Module 1: Ontsnappen uit de Matrix", "Module 2: Je eerste Werkopdracht").

## Deel 3: AI Concierge Finetuning (De Poortwachter)
*Status: De conversie-machine.*
De AI Concierge (het onboarding chat-systeem) moet genadeloos goed worden in upselling.
*   **Doelwit:** De AI System Prompt aanpassen.
*   **Flow:** Als een gebruiker binnenkomt met schulden, moet de AI niet alleen vertellen hoe ze kunnen besparen, maar actief de Opportunity Engine aandragen: *"Ik zie dat je geld nodig hebt. Als je upgrade naar de Apex Operator Tier, kun je direct opdrachten voor The Godbrain uitvoeren."*

---

> [!IMPORTANT]
> **User Review Required: De Academie Content**
> Voordat ik de database voor de Academie (`Course` / `Lesson`) bouw, wil ik zeker weten: **Heb je de content (video's/teksten) al klaar, of gaan we eerst dummy-content gebruiken zodat je het systeem kunt zien draaien?**

> [!WARNING]
> **Open Question: Financiële Koppelingen**
> Voor de War Room Financials: wil je dat ik dit in eerste instantie simuleer (met realistische grafieken gebaseerd op de interne database), of verwacht je dat ik dit later aan je echte bankrekening (bijv. via een API) ga koppelen? Voor nu bouw ik de interne rekentool.

Geef een **Proceed** als dit plan precies dekkend is voor wat we moeten bouwen. Dan gooi ik The Triple Threat in productie.
