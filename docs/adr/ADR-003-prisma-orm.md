# ADR-003: Prisma als ORM

## Status
Geaccepteerd

## Context
De Modular Monolith heeft een betrouwbare interactie nodig met de PostgreSQL database (Supabase). Er is behoefte aan type safety en efficiënte schema-migraties.

## Beslissing
We gebruiken **Prisma ORM**.
*   Het `schema.prisma` is de Single Source of Truth voor ons relationele model.
*   Prisma wordt gebruikt voor de migraties en de gegenereerde TypeScript client.

## Consequenties
**Positief:**
*   Type-veiligheid direct gekoppeld aan het database schema.
*   Zeer snelle developer experience (DX).
*   Eenvoudig leesbaar model-overzicht.

**Negatief:**
*   Bij extreem zware analytische query's (wat opgelost wordt met specifieke CQRS Read Models of raw SQL) kan Prisma langzamer zijn dan query builders zoals Kysely of Drizzle. Dit accepteren we.
