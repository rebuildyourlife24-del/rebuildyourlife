# AGENTIC OS CONSTITUTION

## De Autonome Architectuur
The Syndicate bestaat uit een ecosysteem van sub-agents. Elk van deze agents (CEO, CFO, CMO, COO, Hermes, Orion) heeft zijn eigen rol, maar ze moeten naadloos kunnen samenwerken onder een gezamenlijk Operating System (The Agentic OS).

## 1. De Sovereign AI Router
* Geen enkele agent is afhankelijk van slechts één LLM provider. De **Sovereign AI Router** routeert intern tussen Cerebras, Groq, Google Gemini en OpenRouter.
* Als een agent tegen een rate limit aanloopt, moet het falen onzichtbaar zijn voor de Operator: de router vangt de `429` af en herstart de prompt bij de volgende provider in prioriteit.

## 2. Multi-Agent Delegatie
* Agents proberen niet alles zelf te doen.
* Als de CFO (financiën) vraagt om een marketingbudget te optimaliseren, delegeert hij de scraping/research taak naar de CMO (marketing agent).
* De communicatie tussen agents loopt via asynchrone systemen of tools zoals `send_message` (of interne webhook endpoints).
* **Infinite Loop Preventie**: Agents mogen elkaar nooit in een eindeloze "Wat vind jij?" loop brengen. Elke interactie moet leiden tot een beslissing, code-wijziging, of een output naar de Operator.

## 3. Human-In-The-Loop (HITL)
* Het systeem is primair autonoom, MAAR handmatig stuurbaar. De Operator behoudt *god mode*.
* Kritieke agent-beslissingen (bijv. "Ik ga $50 besteden aan Ads") vereisen toestemming via een Inbox/Approval UI, tenzij het budget is geautomatiseerd via instellingen.

## 4. XP & Leveling (Gamification)
* Interactie met agents levert XP (Experience Points) op.
* XP berekening: De nadruk ligt op **omzetgeneratie**, **hoge verdiensten**, en **diepgaande interactie met het systeem**. 
* Geen simpele beloning voor inloggen (daily login bonus), maar beloning voor daadwerkelijke business waarde creatie door de systemen heen (bijv. $1.000 omzet = +5.000 XP).
