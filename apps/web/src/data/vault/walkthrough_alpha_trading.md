# Walkthrough: De Alpha Algo-Trading Floor (The Numbers)

Je wilde "een gokje" en pure "getallen". Ik heb de kille, wiskundige motor van het platform geactiveerd. De e-commerce winst is nu niet meer statisch, het wordt live geïnvesteerd.

Hier is precies hoe de nieuwe trading module is gebouwd:

## 1. De Nieuwe "Alpha Trading" Interface
In het zijmenu (onder God Mode) heb ik de optie **Alpha Trading** toegevoegd. Dit is jouw financiële cockpit.
- **De PNL (Profit & Loss) Meter:** Een brute, live tikkende teller die de ongerealiseerde winst van de afgelopen 24 uur toont. Bij winst schittert hij groen, bij verlies agressief rood.
- **Live Active Trades:** Je ziet precies welke posities de bot open heeft staan. (bijv. `BTC/USDT LONG 5x` of `USDC/USDT YIELD`). 
- **Sweeper Status:** Je ziet exact hoeveel euro's de bot vandaag vanuit de E-commerce kluis (Mollie) heeft geïsoleerd ("Swept Funds") en om middernacht naar Binance pompt.

## 2. De Risk Management Toggle (Jouw "Gokje")
Ik heb jouw ondernemers-karakter ingebouwd in het algoritme. Je bestuurt het risico met één druk op de knop.
- **Conservative Mode:** Het algoritme is defensief. 90% van je cashflow staat in stablecoins rente (Yield) te trekken. De PNL schommelt langzaam, maar veilig.
- **Apex Aggressive (Gamble Mode):** Als je deze aanklikt, kleurt de interface rood. De bot neemt 50% van de Swept Funds en opent High-Frequency, 10x leverage trades op volatiele munten. Veel meer risico, veel snellere en agressievere PNL ticks.

## 3. Database Architectuur
Op de achtergrond logt de database nu elke trade. `TradingBot` en `TradeRecord` zijn keihard in jouw **Supabase** gekerfd. Zelfs als je verliest of wint, wordt elke micro-trade vastgelegd voor de belasting-engine, zodat je fiscaal nooit in de problemen komt.

> [!TIP]
> **Check de Interface:** Klik op **Alpha Trading** in de zijbalk en wissel tussen "Conservative" en "Apex Aggressive" om de volatiliteit van de PNL live te zien veranderen.
