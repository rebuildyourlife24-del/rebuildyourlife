# ADR-006: Workspace (Tenant) Isolatie

## Status
Geaccepteerd

## Context
RYL OS is een SaaS / Platform. Gebruikers werken binnen bedrijfscontexten en mogen *nooit* (ook niet per ongeluk) data van andere bedrijven inzien of AI Agents op de verkeerde kennisbank laten trainen.

## Beslissing
**Workspace Isolation** is de absolute grens.
*   Elk record in de database dat bedrijfsdata bevat (bijv. `LedgerEntry`, `AgentDefinition`, `VectorEmbedding`) MOET gekoppeld zijn aan een `workspaceId`.
*   Elke API request, Database Query en Vector Search MOET gefilterd worden op `workspaceId`. Er mogen geen queries over de grens van de Workspace heen gemaakt worden, tenzij in het `admin` domein.

## Consequenties
**Positief:**
*   Waterdichte databeveiliging voor klanten.
*   Voorbereiding op database-sharding per workspace als het platform enorm schaalt.

**Negatief:**
*   Ontwikkelaars moeten bij elke database operatie handmatig `where: { workspaceId }` toevoegen of tenant-middleware gebruiken om datalekken te voorkomen.
