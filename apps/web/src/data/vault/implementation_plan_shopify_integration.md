# Implementatieplan: Shopify API Integratie (Live Data)

Je wilt je twee bestaande Shopify webshops niet weggooien, maar je wilt ze wél **assimileren** in het Godbrain. Oftewel: de War Room (J.A.R.V.I.S.) moet live meekijken in de kassa's van je Shopify winkels.

## Hoe dit werkt (De Techniek)
We gaan Shopify niet via de voorkant laden, we breken in via de achterdeur (de Shopify Admin API). 
Hierdoor hoef je Shopify niet te verlaten, maar stroomt je omzet, klantdata en productinformatie direct je Rode War Room binnen.

## Actieplan
1. **API Koppeling Bouwen:** Ik bouw een onzichtbare "brug" in je code (`shopify.service.ts`) die direct communiceert met de beveiligde servers van Shopify.
2. **Koppelings-scherm:** Ik maak een formulier in je *Franchise Netwerk* (Blauwe Zone) waar je straks twee dingen kunt invullen per winkel:
   - Je Shopify Domeinnaam (bijv. `jouw-winkel.myshopify.com`)
   - Je Shopify API Sleutel (die je zelf in je Shopify instellingen kunt aanmaken).
3. **Live War Room Data:** Zodra gekoppeld, pas ik de Rode War Room aan. In plaats van gesimuleerde data (wat we nu hebben om het te laten lijken op Iron Man), zie je dan **exacte, realtime inkomsten** van jouw 2 Shopify winkels in neon rood.

> [!IMPORTANT]
> **Jouw taak (Straks):**
> Om dit te laten werken, moet je straks inliggen op Shopify. Ga naar Instellingen -> Apps -> App-ontwikkeling -> "Maak een app". Hier krijg je een "Admin API Toegangstoken" (een lange code die begint met `shpat_`). **Dit is de sleutel die we de Godbrain gaan voeren.**

## Start de Integratie
Druk op **'Proceed'** als je akkoord bent. Ik schrijf dan direct het dashboard-formulier en de API-code zodat je jouw 2 webshops aan de machine kunt koppelen.
