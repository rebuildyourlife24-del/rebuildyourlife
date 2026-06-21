# Implementatieplan: ORION ULTIMATE (Hybride Architectuur)

We gaan de bestaande, gigantische `rebuildyourlife` monorepo op jouw laptop ombouwen naar **Orion Ultimate**. 

## De Belangrijkste Eis: De Supabase Bridge
Omdat jouw originele "Orion 1" in de Supabase database zit met al zijn opgebouwde geheugen, trekken we Supabase **niet** los. In plaats daarvan maken we een communicatiebrug:
- **Orion Ultimate** draait als een superkrachtig lokaal wezen op jouw laptop (via Ollama, Node.js en Next.js).
- Hij leest en schrijft naar de **Supabase Database**, waardoor hij direct kan communiceren en kennis kan uitwisselen met "Orion 1" (die in de cloud leeft).
- Lokaal bouwen we een extra laag (ChromaDB) voor je privédocumenten en code-analyse die niet naar de cloud mag.

## User Review Required

> [!IMPORTANT]
> **Hybride Geheugen:** Klopt het dat we het geheugen splitsen? 
> 1. **Supabase (Cloud):** Voor het synchroniseren met Orion 1 en SaaS data.
> 2. **ChromaDB / Lokale Opslag:** Voor het lokaal indexeren van jouw laptop bestanden (PDF's, lokale git repositories) zodat je laptop-data privé blijft.

## De Modules (Binnen de bestaande `rebuildyourlife` repo)

### 1. `apps/command-center` (De Frontend)
- Next.js dashboard.
- Toont de status van zowel de lokale Agenten als de Supabase connectie met Orion 1.
- Knoppen voor [Praat], [Typ], [Projecten].

### 2. `apps/api` (De Node.js Backend & Agent Router)
- Stuurt de lokale Ollama modellen aan (Hermes, DeepSeek, Qwen).
- Bevat de Multi-Agent Raad (Architect, Developer, Researcher).
- Haalt actief geheugen op uit Supabase (Orion 1) om context te behouden.
- Bevat de web-scraper voor live 24/7 internet toegang.

### 3. De Zelfevaluatie Loop
- Na elk antwoord praat de lokale Orion Ultimate met Orion 1 in Supabase om te loggen wat er geleerd is: Wat werkte wel? Wat werkte niet?

## Volgende Stappen
Zodra je akkoord gaat met deze brug tussen jouw laptop en Supabase, gaan we de `apps/api/src/ai/orion.ts` en de Next.js interface aanpassen om deze mega-operatie in werking te stellen.
