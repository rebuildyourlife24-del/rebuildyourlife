# Plan: Shopify API Assimilatie (Live Data)

De API sleutels voor `build-your-dream-30fnc3bp.myshopify.com` zijn succesvol in de Godbrain geïnjecteerd.
Nu gaan we Fase 1 (The Foundation) daadwerkelijk afronden door de simulatie uit te schakelen en de War Room te voeden met échte live omzetcijfers.

## Wat ik ga bouwen:

1. **De Shopify Data Extractor (Backend API):**
   Ik bouw een beveiligde API-route (`/api/shopify/stats`) die de `shpss_` API-sleutel gebruikt om direct in te breken in jouw Shopify kassa.
   We trekken de volgende data eruit:
   - Totale omzet (Vandaag)
   - Totaal aantal bestellingen
   - Conversieratio of gemiddelde orderwaarde.

2. **War Room UI Update (Frontend):**
   In `war-room/page.tsx` vervang ik de neppe statische "SIMULATIE" cijfers (zoals € 12.450,00) door een live verbinding met de nieuwe extractor.
   Als er geen data is, of de sleutel faalt, toont het systeem netjes een "OFFLINE" of "INITIALIZING..." status.

## Verwacht Resultaat
Zodra je de War Room herlaadt, zie je geen simulatie meer, maar de keiharde werkelijkheid van jouw eigen webshop geprojecteerd naast het kloppende neurale brein.

Ik ga dit nu direct in de code verwerken.
