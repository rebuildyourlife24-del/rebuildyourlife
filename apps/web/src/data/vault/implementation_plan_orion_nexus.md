# Implementatieplan: ORION CORE (Volledige Architectuur)

Dit plan beschrijft de route om de volledige, door jou aangeleverde **ORION CORE** stack te bouwen.

## De Doelarchitectuur

```text
┌─────────────────────────────┐
│         ORION CORE          │
├─────────────────────────────┤
│ Voice Interface             │ (Nieuw)
│ Chat Interface              │ (Actief in orion_app.py)
│ Agent Council               │ (Actief in orion_app.py)
│ Long-Term Memory            │ (Actief via SQLite)
│ Knowledge Graph             │ (In ontwikkeling)
│ Task Manager                │ (Nieuw)
│ Automation Engine           │ (Nieuw)
├─────────────────────────────┤
│ Ollama Model Router         │ (Nieuw - dynamisch wisselen)
│ Hermes                      │
│ DeepSeek                    │
│ Qwen                        │
│ Future Models               │
├─────────────────────────────┤
│ Local File System           │
│ Documents                   │
│ Projects                    │
│ Media Library               │
│ Databases                   │
└─────────────────────────────┘
```

## User Review Required

> [!IMPORTANT]
> **Voice Interface & Automation:** Om spraakherkenning en automatisering (zoals zelfstandig bestanden verplaatsen of scripts starten) toe te voegen, moet de Python backend systeemrechten krijgen en toegang tot je microfoon. Ga je akkoord met deze verregaande integratie?

> [!WARNING]
> **Ollama Model Router:** Dit betekent dat Orion tijdens een taak (bijv. coderen) zelfstandig Ollama kan vertellen om DeepSeek te laden, en voor onderzoek Qwen laadt. Dit vereist wel dat je deze modellen lokaal via Ollama installeert (bijv. `ollama pull deepseek-coder`). Heb je genoeg RAM voor deze model-wissels?

## Voorgestelde Fasering

### Fase 1: Huidige Status (Voltooid)
- Chat Interface (PyWebView UI).
- Agent Council (Architect, Developer, Researcher met Live Internet).
- Long-Term Memory (Basis SQLite).

### Fase 2: De Model Router & Knowledge Graph (Huidige focus)
- **Model Router:** Code aanpassen zodat `orion_app.py` per Agent een ander Ollama model kan aanroepen.
- **Knowledge Graph & Local Files:** Orion toegang geven tot specifieke mappen op je C-schijf om documenten te lezen.

### Fase 3: Automation Engine & Task Manager
- Orion kan scripts schrijven én direct zelf uitvoeren.
- Een ingebouwde TODO/Task manager in de UI die Orion zelf bijwerkt na een gesprek.

### Fase 4: Voice Interface
- Toevoegen van lokale spraakherkenning (bijv. OpenAI Whisper lokaal) zodat je handsfree met Orion kunt praten in de command center UI.

## Open Vragen
1. Welke modellen (naast Hermes) heb je momenteel al geïnstalleerd in Ollama voor de Model Router?
2. Zullen we in de code direct de brug bouwen naar je lokale File System, zodat hij vanaf nu in je documenten kan zoeken?
