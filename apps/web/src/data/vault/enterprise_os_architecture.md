# Enterprise Commerce Operating System (5-Layer Architecture)

Dit document beschrijft de strikte technische architectuur voor het subdomein (gehost via Strato/Vercel). Het roer gaat om: de AI is niet langer een "chatbot" of een pratend brein op het scherm. De AI wordt het **onzichtbare Operating System** op de achtergrond. Het Dashboard is het Product. Jij bent de Bestuurder.

> [!WARNING]
> Alle sci-fi elementen, pratende AI-hoofden en chat-interfaces worden uit het dashboard gesloopt. We gaan naar een 100% data-gedreven, widget-based Enterprise Control Center. Acties via knoppen (Approve/Reject) in plaats van via chat.

---

## LAYER 1 — CONTROL CENTER (De Voorkant)
Een strakke hoofdomgeving zonder zwevende logs of terminals.

**Structuur (Tabs):**
- `/Overview` (De Executive Samenvatting)
- `/Operations`
- `/Marketing`
- `/SEO`
- `/Growth`
- `/Finance`
- `/Projects`
- `/AI_Activity` (Hierin zitten de logs verborgen, pas zichtbaar na klik)
- `/Reports`
- `/Knowledge`
- `/Settings`

*Visuele Regel: Dashboard > Agent. Geen chatvensters, alleen overzichtelijke grafieken en tabellen.*

---

## LAYER 2 — KNOWLEDGE VAULT (Het Brein)
Alle output die agenten genereren, belandt niet in een chat, maar direct in de Vault. Alles is doorzoekbaar en filterbaar.

**Mappenstructuur:**
`/Decisions`, `/Reports`, `/Experiments`, `/Insights`, `/Assets`, `/Campaigns`, `/Templates`, `/SOP`, `/Archive`

**Metadata bij elk item:**
- Titel
- Eigenaar (Agent of Mens)
- Status (Draft, Review, Approved, Active)
- Categorie
- Datum
- Prioriteit
- Bron

---

## LAYER 3 — AGENT ORCHESTRATION (De Achterkant)
Agenten zijn vanaf nu **onzichtbaar**. Ze werken op de achtergrond.
**Route van AI-Output:**
1. Agent doet onderzoek/taak.
2. Output gaat naar **Validation** (klopt het format?).
3. Output gaat naar **Categorisatie** (in welke map hoort het?).
4. Output gaat naar de **Wachtrij (Dashboard)**.
5. (Na menselijke actie) -> Naar archief of publicatie.

*Regel: Geen directe AI-output op het scherm zonder categorisatie.*

---

## LAYER 4 — HUMAN CONTROL (De Bestuurder)
Jij hebt de absolute controle via een "Review Mode" wachtrij in het dashboard. De AI publiceert **nooit** zelfstandig.

**Actieknoppen per AI-voorstel:**
`[ Approve ]` `[ Reject ]` `[ Edit ]` `[ Pause ]` `[ Undo ]` `[ Rollback ]` `[ Assign ]` `[ Schedule ]`

**Werkmodes van het Systeem:**
1. **Silent Mode:** AI analyseert puur op de achtergrond.
2. **Review Mode (Standaard):** AI zet alle acties/rapporten klaar in de wachtrij voor jouw Approval.
3. **Autonomous Mode:** AI mag binnen stricte, kleine limieten zelf uitvoeren (bijv. simpele tweets sturen).

---

## LAYER 5 — EXECUTIVE MODE (De Widgets)
Jij ziet alleen wat belangrijk is, gesplitst per virtuele manager:

- **CEO Overview:** KPI's, Revenue, SEO, Traffic, Tasks, Forecast, Alerts.
- **COO:** Workload, Bottlenecks, Delivery.
- **CMO:** Campaign Health, ROAS, Experiments.
- **DATA:** Insights, Predictions.

---

## Verplichte Output Formaat
Iedere goedgekeurde taak belandt in de database met deze strakke velden, zonder onnodige AI-uitleg:
```yaml
RESULT: [Wat is er bereikt?]
LOCATION: [In welke map staat dit?]
OWNER: [Naam]
STATUS: [Done/Pending]
IMPACT: [Verwachte opbrengst/risico]
NEXT_STEP: [Wat is de vervolgactie?]
```

## User Review Required
> [!IMPORTANT]
> Dit is een enorme visuele en technische draai. Het betekent dat ik het huidige "War Room" dashboard met de hologrammen en de chatbalk ga vervangen door een superstrak, zakelijk, widget-based Enterprise Dashboard. Klopt dit helemaal met jouw visie voor de 5 Lagen? Zodra je "JA" zegt, sloop ik de oude UI en bouw ik Layer 1 en Layer 4 (Control Center + Review Queue).
