# Implementatieplan: Multi-Tenant Domein Routing (De Spin in het Web)

Je hebt 10 subdomeinen op `ai-henksemler.nl` klaarstaan. Dat is perfect. Het "Empire" model vereist dat we dit systeem opzetten als een **Multi-Tenant Architectuur** (zoals Shopify of Vercel zelf doet). 

In plaats van 10 losse websites te bouwen, bouwen we één master-systeem dat zich gedraagt als een kameleon, afhankelijk van welk domein de bezoeker intypt.

## Waarom Subdomeinen Superieur Zijn (Mijn Advies)
Je vroeg wat de beste oplossing is (subdomeinen of losse pagina's). **Subdomeinen zijn 100% beter.**
Als we `fitness.ai-henksemler.nl` en `vastgoed.ai-henksemler.nl` gebruiken, ziet de klant twee compleet losstaande bedrijven. Als we `ai-henksemler.nl/fitness` doen, ziet de klant dat het een sub-onderdeel is. Voor maximale psychologische autoriteit en SEO willen we de illusie wekken dat elke franchise een los, gigantisch bedrijf is. Jouw Godbrain verbindt ze op de achtergrond.

## Hoe het gaat werken: De "Middleware Router"
We gaan in de kern van de Next.js code een `middleware.ts` bestand schrijven. Dit is de "Verkeersregelaar" van jouw imperium.

1. **Bezoeker typt:** `app.ai-henksemler.nl`
   - **Router doet:** Checkt in de database. "Dit is het hoofdkwartier." Laat het inlogscherm en de God Mode (Command Center, Syndicate, Alpha Trading) zien.
   
2. **Bezoeker typt:** `shop1.ai-henksemler.nl` (of welke franchise naam je ook kiest)
   - **Router doet:** Haalt ongezien de data van Franchise #1 uit de database. Laat een hypermoderne webshop zien, zonder enige God Mode knoppen.

3. **Bezoeker typt:** `invest.ai-henksemler.nl`
   - **Router doet:** Toont wellicht een chique landingspagina voor investeerders om geld in jouw fondsen te stoppen.

## Wat ik ga bouwen (Het Actieplan)
- `[ ]` **Stap 1: De Verkeersregelaar (Middleware):** Ik schrijf een `middleware.ts` file die elke binnenkomende bezoeker opvangt, kijkt naar de URL in de adresbalk, en ze razendsnel (binnen milliseconden) naar de juiste module (App of Webshop) doorstuurt.
- `[ ]` **Stap 2: De "Omega Storefront" Route:** Ik bouw een onzichtbare map (`/app/[domain]/page.tsx`) in de code. Als iemand naar een subdomein gaat, rendert de server volautomatisch een webshop op basis van wat jij in het Omega Builder dashboard hebt ingevoerd.
- `[ ]` **Stap 3: Vercel Configuratie Klaarmaken:** Ik bereid de code zo voor, dat als je het morgen naar Vercel pusht, je daar simpelweg "Wildcard Domains" (`*.ai-henksemler.nl`) kunt aanzetten en álles direct werkt.

## Akkoord?
Zodra je op **'Proceed'** drukt, leg ik het kloppende hart van deze routing vast in de code. Dit is de ruggengraat waardoor je 10 (of zelfs 10.000) webshops kunt beheren vanuit één God Mode systeem!
