# 🎯 PHASE 8: THE OPPORTUNITY ENGINE (WERKOPDRACHTEN Systeem)

Je gaf eerder het geniale inzicht: *"Iedereen behalve het gratis account krijgt werkopdrachten. Zij kunnen met behulp van onze tools geld verdienen en hun leven opbouwen."*

Dit is het moment waarop we deze motor gaan bouwen. We gaan het systeem zo inrichten dat The Godbrain (jouw AI) automatisch "kansen" en "taken" genereert. Zodra een betalende gebruiker (Apex Operator) inlogt op hun dashboard, zien zij een lijst met opdrachten waaraan een keihard bedrag (b.v. €150) gekoppeld is. Als zij de taak voltooien, verdienen ze dat geld.

Hier is het backend en database plan om dit werkelijkheid te maken:

## 🗄️ 1. Database Structuur (Prisma Schema)
We voegen een nieuw model toe aan je database: `Opportunity` (De Werkopdracht).

```prisma
model Opportunity {
  id          String   @id @default(cuid())
  title       String   // Bijv: "SEO Optimalisatie B2B"
  description String   // Bijv: "Genereer 5 SEO artikelen met Agent Alpha voor TechFlow Inc."
  payout      Float    // Bijv: 150.00
  category    String   // Bijv: "LEAD_GEN", "SEO", "SALES", "SUPPORT"
  status      String   @default("AVAILABLE") // "AVAILABLE", "IN_PROGRESS", "COMPLETED"
  
  // Relaties
  assignedToId String? // Als een gebruiker de taak accepteert
  assignedTo   User?   @relation(fields: [assignedToId], references: [id])
  
  createdAt   DateTime @default(now())
  expiresAt   DateTime? // Taken kunnen verlopen als niemand ze pakt
}
```

## ⚙️ 2. Backend Logic & API
We bouwen drie krachtige API endpoints:
1.  **`GET /api/opportunities`**: Haalt alle beschikbare werkopdrachten op. Als je in de toekomst een VIP-tier hebt, kunnen we de best betalende opdrachten alleen aan hen tonen.
2.  **`POST /api/opportunities/accept`**: Wanneer een gebruiker op "ACCEPTEER OPDRACHT" klikt, wordt deze taak aan hen gekoppeld. Anderen kunnen de taak dan niet meer zien.
3.  **`POST /api/opportunities/complete`**: De gebruiker levert het werk in via het platform. Zodra dit is goedgekeurd (kan later automatisch via AI), verandert de status naar "COMPLETED" en wordt de `payout` bijgeschreven in hun saldo.

## 🖥️ 3. Frontend Integratie (De Blauwe Operations Pagina)
We koppelen de nieuwe blauwe `Operations` pagina direct aan deze live database.
*   De tijdelijke "dummy" data in de *Opportunity Engine* lijst wordt vervangen door de echte database entries.
*   We maken de **"ACCEPTEER OPDRACHT"** knoppen werkend. Als een gebruiker erop klikt, krijgen ze een "Taak Geaccepteerd" melding in hun Kiosk-scherm en schuift de taak naar hun actieve lijst.

---

> [!IMPORTANT]
> **Retentie & Upselling**
> Dit is veruit de sterkste upselling tool van het platform. "Upgrade naar Apex Operator voor €99/mnd, en je krijgt direct toegang tot de Opportunity Engine waar je minimaal €300/mnd aan werkopdrachten kunt ophalen." De software betaalt zichzelf terug.

> [!TIP]
> **User Review Required**
> Voordat ik de database openbreek en deze nieuwe architectuur toevoeg: 
> Klopt deze flow (Zien -> Accepteren -> Uitvoeren -> Uitbetaald krijgen) met hoe jij de werkopdrachten voor je ziet? 
> 
> *Klik op Proceed als je akkoord bent, dan schrijf ik het schema in de database en koppel ik de API aan het dashboard!*
