# Nieuwe Shopify Integratie Flow

Je kunt nu je Shopify winkel koppelen zónder ooit nog het Partner Dashboard te hoeven aanraken of rode errors te krijgen! 

## Wat is er gebouwd? (Fase 1)

We hebben een nieuwe **Integraties** pagina toegevoegd aan het Godbrain Dashboard. Dit is de veilige kluis waar we API sleutels opslaan.

1. Je gaat in het menu naar **Settings** (Instellingen).
2. Rechtsboven zie je nu een knop: **Integraties Beheren**.
3. Daar vind je de **Shopify API Koppeling**. 

## Hoe gebruik je dit (voor jou én voor klanten)?

Vanaf vandaag is dit de **enige** instructie die we ooit nog nodig hebben:

> [!TIP]
> **Stap 1:** Ga in je webshop naar `Instellingen -> Apps en verkoopkanalen -> Apps ontwikkelen`.  
> **Stap 2:** Klik "Een app maken", geef lees-rechten voor Orders & Producten, en klik Installeren.  
> **Stap 3:** Plak de URL van je winkel (`jouw-winkel.myshopify.com`) en het nieuwe `shpat_` token in de Godbrain Integraties pagina. Klik op Opslaan.

Dat is het! De Godbrain verifieert op de achtergrond direct of het token werkt. Als het werkt, worden je statistieken in de War Room per direct geüpdatet.

Je kunt dit nu direct testen met je `build-your-dream-30fnc3bp.myshopify.com` winkel (als je daar al een token had, of als je er snel één aanmaakt via de Settings pagina van je winkel).

---

> [!NOTE]
> **En Fase 2 (De Auto-Builder)?**
> We hebben nu de springplank gebouwd. Het systeem kan nu tokens verwerken. Zodra we er klaar voor zijn, kunnen we de robot (Fase 2) bouwen die dit formulier onzichtbaar en automatisch invult via de Partner API.
