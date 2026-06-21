# IMPLEMENTATIE PLAN: ENGINE 1 (MULTI-TIER AGENTIC SAAS)
**Project:** De Slimme Abonnementen- & Contractenwacht
**Doelstelling:** De eerste live test ("Shadow Run") om daadwerkelijke omzet te genereren via Engine 1, schaalbaar van €7,50 (Particulier) tot €500 (Enterprise).

## User Review Required
> [!IMPORTANT]
> Je hebt het bereik van Engine 1 gigantisch opgeschaald. We richten ons niet meer alleen op één doelgroep, maar we pakken de hele keten: van de arme student tot de rijke multinational. Om dit te doen zonder dat het merk verwatert, moeten we de **Subdomein Architectuur** gebruiken. Lees dit plan door en geef akkoord op de technische en commerciële structuur.

---

## 1. De Commerciële Tiers (De Waardepropositie)

We splitsen de applicatie op in drie niveaus. Elk niveau heeft een eigen subdomein en een eigen AI-logica. (De exacte financiële pijnpunten per tier worden momenteel door een sub-agent tot op de bodem onderzocht).

### Tier 1: The Consumer Agent (€7,50 / maand)
*   **Doelgroep:** Jongvolwassenen, studenten.
*   **De Pijn:** Netflix, Spotify, sportschool, OnlyFans, maaltijdboxen.
*   **De Oplossing:** De AI scant de mailbox, vindt de "slow leak" abonnementen, en genereert met één druk op de knop opzeggingsmails. 
*   **Locatie:** `app.seoceo.com`

### Tier 2: The Prosumer Agent (€50 / maand)
*   **Doelgroep:** ZZP'ers, Freelancers, Hustlers.
*   **De Pijn:** Overlap in SaaS tools (bijv. 3 verschillende design tools betalen), vergeten hostingkosten, dure energiecontracten.
*   **De Oplossing:** De AI zegt niet alleen op, maar onderhandelt. De AI analyseert de tools en adviseert goedkopere alternatieven, en stuurt autonoom mails naar leveranciers om korting te eisen op basis van contractvervaldata.
*   **Locatie:** `pro.seoceo.com`

### Tier 3: The Enterprise CFO Agent (€250 - €500 / maand)
*   **Doelgroep:** MKB en grotere bedrijven (10-100 medewerkers).
*   **De Pijn:** "Ghost billing". Oud-medewerkers waarvan de €80/mnd softwarelicenties nog maanden doorlopen. Dubbele cloud-servers (AWS/Azure) die niemand uitzet.
*   **De Oplossing:** Een volwaardige digitale CFO. De AI integreert met de zakelijke systemen, identificeert inactieve accounts en sluit deze genadeloos af. Dit bespaart een bedrijf duizenden euro's per maand, wat de €500 prijs direct rechtvaardigt.
*   **Locatie:** `enterprise.seoceo.com`

---

## 2. De Technische Architectuur (Het Subdomein Ecosysteem)

Waarom bouwen we dit op subdomeinen in plaats van losse websites?
1.  **Autoriteit:** Elke bezoeker op `app.seoceo.com` en `enterprise.seoceo.com` versterkt de Google-ranking van jouw hoofddomein (`seoceo.com`). Je bouwt een machtig imperium, geen losse eilandjes.
2.  **Single Sign-On (SSO):** De data wordt gecentraliseerd opgeslagen in jouw Supabase kluis. Als een freelancer (Tier 2) een BV opricht en doorgroeit naar Tier 3, kan hij met exact hetzelfde account direct inloggen op het Enterprise subdomein.
3.  **Ontwikkelingssnelheid:** Ik hoef voor deze "Shadow Run" maar één Next.js applicatie te bouwen. Door *Middleware routing* leest de code welk subdomein wordt bezocht, en toont de bijbehorende interface (Student, Pro of Enterprise). Dit scheelt weken aan programmeerwerk.

## Verificatie Plan
Zodra je akkoord geeft op dit drietrapsraket-model:
1. Wachten we op het inlichtingenrapport van de B2B Analyst Sub-Agent (die is nu bezig).
2. Begin ik met het programmeren van de Subdomein Middleware in Next.js.
3. Bouwen we de eerste MVP (Minimum Viable Product) voor Tier 1 en 2 om tijdens de Shadow Run (voor 1 juli) fysiek online te testen.

**Ga je akkoord met deze Multi-Tier Subdomein Architectuur voor Engine 1?**
