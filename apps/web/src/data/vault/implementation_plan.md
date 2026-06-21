# Supreme Overseer - Lokaal AI Platform Architectuur

Dit plan beschrijft de volledige, productieklare architectuur voor de lokale AI-desktopapplicatie. We bouwen een compromisloos, schaalbaar platform dat lokale modellen (zoals Hermes-3) combineert met geavanceerde RAG, web-automatisering en multi-agent systemen.

## User Review Required

> [!IMPORTANT]  
> Dit is het absolute fundament van het platform. Controleer of de tech-stack en de modulaire opbouw exact aansluiten bij je visie voordat we overgaan tot de fysieke code-generatie.

## Open Questions

> [!WARNING]  
> 1. **Tauri Sidecar:** Wil je dat de Python FastAPI backend volledig onzichtbaar wordt meegebundeld in de Tauri `.exe` / `.app` als een zogenaamde "sidecar", zodat de eindgebruiker maar één applicatie hoeft te openen?
> 2. **Monorepo:** Ik stel voor om het project op te zetten in een Turborepo monorepo-structuur (`apps/desktop` voor Tauri/Next.js, `apps/ai-core` voor Python). Ga je hiermee akkoord?

## Architectuur & Tech Stack

- **Frontend & Desktop Shell:** Tauri (Rust) + Next.js (TypeScript, Tailwind CSS, shadcn/ui).
- **Core AI Backend:** Python + FastAPI (Verantwoordelijk voor zware AI-rekenkracht, RAG, tooling en Playwright).
- **Relationele Database:** SQLite (standaard voor desktop) met SQLAlchemy + Alembic (Python ORM).
- **Vector Database (Geheugen):** ChromaDB (lokaal) voor razendsnelle document-retrieval (RAG).
- **AI Engine:** Ollama API (voor communicatie met Hermes-3 en andere GGUF modellen).
- **Web Automatisering:** Playwright (Python) gestuurd door AI-agenten.

## Systeemcomponenten & Mappenstructuur

Het platform wordt modulair opgebouwd:

```text
supreme-overseer/
├── apps/
│   ├── desktop/                # Next.js + Tauri frontend
│   │   ├── src/
│   │   │   ├── components/     # shadcn/ui componenten (Chat, Sidebar, Dashboard)
│   │   │   ├── lib/            # API clients, WebSocket hooks
│   │   │   └── app/            # Next.js App Router (Dashboard, Settings, Agents)
│   │   └── src-tauri/          # Rust core voor OS-integratie (bestandssysteem)
│   │
│   └── ai-core/                # Python FastAPI backend (De AI Motor)
│       ├── main.py             # FastAPI entrypoint
│       ├── api/                # REST endpoints & WebSockets
│       ├── core/               # Configuratie, Security, DB connecties
│       ├── agents/             # Multi-agent logica (Onderzoek, Code, Browser)
│       ├── memory/             # ChromaDB vector store logica
│       ├── tools/              # Tool-calling (Playwright, File Parser)
│       └── models/             # SQLAlchemy database modellen (SQLite)
```

## Database Ontwerp (Relationeel)

De primaire opslag (SQLite/PostgreSQL) zal de volgende domeinen beheren:
- `users` (Rechten, API keys, voorkeuren)
- `conversations` & `messages` (Gespreksgeschiedenis)
- `agents` (Configuraties per agent: Systeem prompts, toegewezen tools)
- `documents` (Metadata van geüploade bestanden, gekoppeld aan ChromaDB embeddings)
- `models` (Geregistreerde Ollama modellen en instellingen)

## Implementatiefasen (Geen MVP, direct productie-klaar)

### Fase 1: Fundament & Infrastructuur
- Scaffolding van de monorepo.
- Initialisatie van Tauri + Next.js met dark/light mode en shadcn/ui.
- Setup van FastAPI met SQLite en SQLAlchemy.
- WebSocket-verbinding opzetten tussen Next.js en FastAPI voor streaming tokens.

### Fase 2: De AI Engine & Tooling
- Koppeling maken vanuit Python naar de lokale Ollama service.
- Implementatie van tool-calling (Function Calling) voor de AI.
- Bouwen van de `PlaywrightBrowserTool` waarmee de AI websites kan openen, lezen en besturen.
- Bouwen van file-parsers (PDF, DOCX, TXT) en de ChromaDB RAG-pipeline.

### Fase 3: Het Multi-Agent Systeem
- Implementatie van de agent-router in Python.
- Bouwen van specifieke agents: *Browser Agent*, *Onderzoeks Agent*, *Bestands Agent*.
- Integratie van het "Living Memory" (Langetermijngeheugen via vector search).

### Fase 4: De Visuele Interface (Dashboard)
- Bouwen van de complexe layout: Zijbalk (Chats, Bestanden, Agenten, Systeem).
- Chatvenster met real-time streaming, markdown rendering en syntax highlighting.
- Systeemdashboard (Live RAM/CPU/GPU weergave, actief model, Ollama status).

## Verification Plan
1. **Geautomatiseerde Tests:** PyTest voor de Python core (API's, Agent tools), Vitest voor de frontend componenten.
2. **End-to-End Verification:** Een fysieke test waarbij de Tauri-app wordt gecompileerd, een document wordt geüpload, opgeslagen in ChromaDB, en opgevraagd wordt via de Hermes-3 AI over WebSockets.
