# Implementatieplan: Kennis-Extractie & Supabase Injectie

Je hebt gelijk, je hebt een schatkist aan data en intelligentie in je Downloads en mappen staan (waaronder `complete_systeemprompt.md`, `ORION_V1_PROMPT.md`, `REBUILD_Bouwplan_Opus.md`). Deze bestanden bevatten de "ziel" en de regels van je eerdere AI setups (Hermes, Claude, Orion).

## Doel
We gaan deze verspreide kennis (de "installatie bestanden" en prompts) uitlezen en als **Extra Intelligentie** in jouw Supabase database pompen. Hierdoor ontstaat er een gedeeld, superintelligent brein waar zowel Sovereign (op je laptop) als Orion 1 (in de database) continu uit kunnen putten.

## User Review Required

> [!IMPORTANT]
> **Supabase Structuur:** Ik ga een script schrijven dat verbinding maakt met jouw Supabase database via de credentials in de `rebuildyourlife` map. Ik zal een nieuwe tabel (of sectie) aanmaken: `ExtraIntelligence`. Hierin slaan we al die MD-bestanden en prompts op. Ga je hiermee akkoord?

> [!WARNING]
> **Extractie Scope:** Ik focus me in eerste instantie op de `.md` en `.txt` bestanden in je Downloads-map die prompts en bouwplannen bevatten. De grote `.exe` bestanden (zoals `LM-Studio.exe` of `OllamaSetup.exe`) zijn programma's, daar kan ik geen "tekstuele intelligentie" uit halen. Akkoord?

## Voorgestelde Stappen

1. **Stap 1: Data Verzamelen (Extractie)**
   - Ik maak een Python-script dat specifiek zoekt naar:
     - `complete_systeemprompt.md`
     - `ORION_V1_PROMPT.md`
     - `REBUILD_Bouwplan_Opus.md`
     - `persoonlijke_ai_assistent_prompt.md`
   - Het script leest de inhoud van deze bestanden in.

2. **Stap 2: Database Injectie (Supabase)**
   - We gebruiken de Supabase URL en API Key uit je bestaande `.env` bestand (`apps/api/.env`).
   - Het script pompt de verzamelde data direct naar een `Knowledge` of `OrionMemory` tabel met de tag `EXTRA_INTELLIGENCE`.

3. **Stap 3: Sovereign & Orion Koppelen**
   - Zodra de data in Supabase zit, passen we de Python/Node code van Sovereign aan zodat hij, voordat hij antwoord geeft, altijd in deze "Extra Intelligence" database kijkt. Hierdoor krijgt Sovereign exact de kwaliteit en kennis van Hermes, DeepSeek, en Qwen die in die prompts beschreven stonden.

Wachtend op jouw "Go". Als je akkoord bent, schrijf en draai ik direct het extractie-script.
