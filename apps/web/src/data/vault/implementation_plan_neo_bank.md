# Goal: Godbrain Neo-Bank & Trading Wallet (Phase 14)

Je hebt gekozen voor **Optie B**: in plaats van alleen een koppeling te maken met een externe bank, bouwen we een interne "Godbrain IBAN" (Neo-Bank / Banking-as-a-Service model) direct in de cockpit. Hier kun je real-time geld ontvangen, overmaken, en kan The Swarm met een fractie van een seconde met jouw *Syndicate Capital* handelen via een gekoppelde Broker API.

Dit vereist een stevige aanpassing aan de Onboarding en de Database.

## User Review Required

> [!IMPORTANT]
> Omdat we nu opereren als een virtuele bank en handelsplatform, verandert de onboarding. Gebruikers moeten in de onboarding hun "KYC" (Know Your Customer) voltooien. In deze demo zullen we dit simuleren via een prachtig geanimeerd proces waarbij het systeem een virtueel **Godbrain IBAN** genereert.
> Lees de onderstaande stappen door en geef akkoord.

## Open Questions

> [!WARNING]
> Wil je dat we in de Onboarding Flow ook direct virtueel "Startup Kapitaal" storten (bijv. €10.000 gesimuleerd geld) zodat je direct kunt zien hoe The War Room en The Treasury Vault dit geld in real-time verdelen? Of start de IBAN op €0,00?

## Proposed Changes

### 1. Database Schema Updates (`schema.prisma`)

Om de Neo-bank structuur te faciliteren, breiden we het `TreasuryVault` ecosysteem uit.

#### [MODIFY] packages/database/prisma/schema.prisma
We voegen toe / wijzigen:
- `GodbrainAccount`: Nieuw model. Slaat het toegewezen virtuele IBAN, SWIFT/BIC code en de status (ACTIVE, FROZEN) op. Gekoppeld aan de User.
- `TreasuryVault`: We voegen een `vaultType` toe (`OPERATIONS`, `TAX`, `SYNDICATE_CAPITAL`, `TRADING`) zodat we het geld over meerdere fysiek-ogende potjes kunnen splitsen.
- `WalletTransaction`: Een nieuw logboek (Ledger) voor élke real-time trade of afschrijving, met een veld voor `executedBy` (bijv. "SWARM_EXECUTOR" of "USER").

### 2. De Neo-Bank Onboarding Flow

We vervangen de huidige, statische `/onboarding` door een dynamische, high-tech Neo-Bank registratie.

#### [MODIFY] apps/web/src/app/onboarding/page.tsx
We verdelen de onboarding in 4 stappen:
1.  **Identity & KYC**: Gebruiker vult bedrijfsnaam (KvK) in en simuleert een ID-scan. (Afgewerkt in Liquid Glass).
2.  **The Godbrain Charter**: Een ceremonieel digitaal contract waarin de gebruiker The Swarm officieel mandaat geeft om met een X% commissie te traden en operaties uit te voeren.
3.  **IBAN Generatie**: Het scherm toont een matrix-achtige generator die live een "NL99 GDBR..." IBAN creëert.
4.  **Treasury Allocation**: De gebruiker kiest hoe binnenkomend geld wordt verdeeld (bijv. 30% Tax, 50% Ops, 20% Capital).

### 3. De Backend Logic (The Bank Engine)

#### [NEW] apps/web/src/lib/orion/neo-bank.ts
Een nieuwe API engine die de simulatie van de bank regelt:
- `generateGodbrainIBAN(userId)`
- `routeIncomingFunds(amount, routingRules)`: De functie die een storting pakt en direct, zonder wachttijd, opsplitst naar de verschillende `TreasuryVaults`.

## Verification Plan

### Automated Tests
- Testen of een inkomende transactie in `neo-bank.ts` foutloos in procenten wordt gekliefd en in de juiste `TreasuryVault` balances wordt gestort.

### Manual Verification
- We doorlopen zelf de hele `/onboarding`.
- We genereren het IBAN, tekenen het charter, verdelen de potjes, en kijken of we in *The War Room (Quantum Treasury)* live het IBAN en onze toegewezen kapitalen zien verschijnen.
