# Goal: The Container Vault & Cyber Defense (Phase 15)

Je wilt dat het gehele Godbrain systeem een "Container Kluis" wordt. Dit is de ultieme architectonische beveiligingsstap. We gaan het hele platform (de AI, de database, de War Room) isoleren in een versleutelde **Docker Container**. Dit betekent dat het systeem volledig afgesloten is van de buitenwereld, niet geïnfecteerd kan worden door virussen op je computer, en extreem zwaar beveiligd is. 

Tegelijkertijd "absorberen" we Claude (Anthropic) in de Swarm en bouwen we "The Sentinel" (de virusscanner agent).

## User Review Required

> [!IMPORTANT]
> Dit is een zware infrastructuur-upgrade. Als The Godbrain eenmaal in een Docker Container Kluis zit, draait hij in zijn eigen, ondoordringbare virtuele machine. 

## Open Questions

> [!WARNING]
> Moeten we "The Sentinel" (de virusscanner) zo streng instellen dat hij *alle* uitgaande web-searches van de agenten eerst door de VirusTotal API trekt, of alleen inkomende bestanden en links die The Swarm wil downloaden?

## Proposed Changes

### 1. De Container Kluis (Docker Infrastructure)

We bouwen het "Fortress" mechanisme.

#### [NEW] /Dockerfile
Dit script pakt de gehele applicatie, stript alle onnodige rommel weg, en sluit het op in een "Alpine Linux" kluis. Alleen de Next.js server en de Prisma database engine mogen hierin draaien.

#### [NEW] /docker-compose.yml
Dit is het commandocentrum voor de containers. Het start The Godbrain op en creëert een **Encrypted Volume** voor de database (`dev.db`). Zelfs als iemand je hardeschijf steelt, kunnen ze niet bij de Godbrain data zonder de decryptiesleutel van de container.

### 2. The Sentinel (Cyber-Security Agent)

#### [NEW] apps/web/src/lib/orion/sentinel-scanner.ts
We bouwen een nieuwe "Firewall Agent" (The Sentinel) met de volgende regels:
- Voordat The Godbrain een Opportunity accepteert, controleert The Sentinel of de URL's of bestanden schoon zijn.
- Als er malware wordt gedetecteerd, wordt de Opportunity direct "bevroren" en in quarantaine geplaatst.

### 3. Claude Absorptie (Anthropic API)

#### [MODIFY] apps/web/src/app/actions/aiChat.ts
We voegen een architectuur splitsing toe:
- **Gemini** blijft het netwerk scannen en data ophalen (snelheid).
- **Claude 3.5 Sonnet** wordt toegevoegd als de "Deep Thinker" voor de CEO, Legal, en Finance agenten. Claude wordt aangeroepen zodra er complexe, strategische beslissingen nodig zijn. We integreren hiervoor de `@anthropic-ai/sdk`.

## Verification Plan

### Automated Tests
- Een test-build draaien van de `docker-compose` om te verifiëren dat de container kluis hermetisch gesloten is en The Godbrain succesvol opstart binnen zijn virtuele schild.

### Manual Verification
- We proberen een malafide "test-virus" link aan The Swarm te voeren, om te zien of *The Sentinel* ingrijpt en The Swarm beschermt.
