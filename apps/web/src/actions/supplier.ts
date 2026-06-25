'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { getSessionAction } from '@/app/actions/auth';

// 1. Seed Supplier en SupplierProduct data als er geen data is
export async function seedSupplierIntelligenceAction() {
  try {
    const session = await getSessionAction();
    if (!session.success || !session.user) {
      throw new Error('Niet geauthenticeerd');
    }

    const supplierCount = await db.supplier.count();
    if (supplierCount > 0) {
      return { success: true, message: 'Supplier data is al aanwezig.' };
    }

    // Maak 4 leveranciers aan met verschillende betrouwbaarheidsprofielen
    const suppliers = [
      {
        name: 'Apex Dropship Corp (Shenzhen)',
        contactEmail: 'sales@apexdropship.cn',
        rating: 4.8,
        successRate: 0.97,
        avgDeliveryTime: 4.2, // dagen
        reliabilityScore: 0.95,
      },
      {
        name: 'EuroExpress Logistics (Rotterdam)',
        contactEmail: 'info@euroexpress.nl',
        rating: 4.5,
        successRate: 0.99,
        avgDeliveryTime: 1.8, // dagen
        reliabilityScore: 0.98,
      },
      {
        name: 'Nomad Global Trade (Istanbul)',
        contactEmail: 'contact@nomadtrade.tr',
        rating: 4.1,
        successRate: 0.90,
        avgDeliveryTime: 5.5, // dagen
        reliabilityScore: 0.85,
      },
      {
        name: 'BargainSupply Co. (Guangzhou)',
        contactEmail: 'deals@bargainsupply.com',
        rating: 3.7,
        successRate: 0.82,
        avgDeliveryTime: 8.4, // dagen
        reliabilityScore: 0.70,
      },
    ];

    const createdSuppliers = [];
    for (const sup of suppliers) {
      const created = await db.supplier.create({ data: sup });
      createdSuppliers.push(created);
    }

    // Producten om te seeden
    // We hebben 3 kernproducten (SKUs) met verschillende inkoopprijzen per leverancier
    const productsToSeed = [
      {
        sku: 'RYL-FIT-BAND-X',
        name: 'Bio-Hacking Pulse Tracker X1',
        prices: {
          'Apex Dropship Corp (Shenzhen)': { cost: 18.50, srp: 89.00, stock: 1200 },
          'EuroExpress Logistics (Rotterdam)': { cost: 24.90, srp: 89.00, stock: 450 },
          'Nomad Global Trade (Istanbul)': { cost: 21.00, srp: 89.00, stock: 600 },
          'BargainSupply Co. (Guangzhou)': { cost: 14.20, srp: 89.00, stock: 2000 },
        }
      },
      {
        sku: 'RYL-NEURO-NRT',
        name: 'Neuro-Enhancer Nootropic Stack',
        prices: {
          'Apex Dropship Corp (Shenzhen)': { cost: 12.00, srp: 49.00, stock: 800 },
          'EuroExpress Logistics (Rotterdam)': { cost: 16.50, srp: 49.00, stock: 350 },
          'Nomad Global Trade (Istanbul)': { cost: 14.00, srp: 49.00, stock: 500 },
          'BargainSupply Co. (Guangzhou)': { cost: 9.80, srp: 49.00, stock: 1500 },
        }
      },
      {
        sku: 'RYL-BLUE-GLASS',
        name: 'Deep Sleep Blue-Light Blockers',
        prices: {
          'Apex Dropship Corp (Shenzhen)': { cost: 6.50, srp: 29.90, stock: 2500 },
          'EuroExpress Logistics (Rotterdam)': { cost: 9.00, srp: 29.90, stock: 800 },
          'Nomad Global Trade (Istanbul)': { cost: 7.80, srp: 29.90, stock: 1100 },
          'BargainSupply Co. (Guangzhou)': { cost: 4.90, srp: 29.90, stock: 4000 },
        }
      }
    ];

    for (const prod of productsToSeed) {
      for (const [supName, priceData] of Object.entries(prod.prices)) {
        const supplier = createdSuppliers.find(s => s.name === supName);
        if (supplier) {
          await db.supplierProduct.create({
            data: {
              supplierId: supplier.id,
              sku: prod.sku,
              name: prod.name,
              costPrice: priceData.cost,
              suggestedRetailPrice: priceData.srp,
              stock: priceData.stock
            }
          });
        }
      }
    }

    // Seed historical Profit Logs over 15 dagen om een stijgende winstlijn te tonen
    const skus = ['RYL-FIT-BAND-X', 'RYL-NEURO-NRT', 'RYL-BLUE-GLASS'];
    const now = new Date();
    
    for (let i = 14; i >= 0; i--) {
      const logDate = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      
      for (const sku of skus) {
        // Bereken stijgende lijn in winst en velocity
        const dayMultiplier = (15 - i) / 15; // stijgt van 0.06 naar 1.0
        
        let costPrice = 18.50;
        let basePrice = 79.00;
        if (sku === 'RYL-NEURO-NRT') { costPrice = 12.00; basePrice = 39.00; }
        if (sku === 'RYL-BLUE-GLASS') { costPrice = 6.50; basePrice = 24.90; }

        // Prijs optimalisatie stappen: prijs stijgt lichtjes en winst stijgt sneller
        const sellingPrice = basePrice + (dayMultiplier * 10.0);
        const margin = sellingPrice - costPrice;
        
        // Velocity stijgt naarmate de optimizer betere prijzen kiest en volume toeneemt
        const salesVelocity = (2.5 + (dayMultiplier * 4.5)) * (sku === 'RYL-BLUE-GLASS' ? 2 : 1);
        const profit = margin * salesVelocity;
        
        // Elasticiteit ligt rond de -1.2 tot -1.8
        const elasticity = -1.2 - (Math.random() * 0.5);
        const optimizedPrice = sellingPrice + (Math.random() * 2 - 1);

        await db.profitOptimizationLog.create({
          data: {
            sku,
            costPrice,
            sellingPrice,
            profitMargin: margin,
            salesVelocity,
            elasticity,
            optimizedPrice,
            createdAt: logDate
          }
        });
      }
    }

    revalidatePath('/dashboard/franchises/intelligence');
    return { success: true, message: 'Supplier en Profit Optimizer data succesvol geseed.' };
  } catch (error: any) {
    console.error('Failed to seed supplier data:', error);
    return { success: false, error: error.message };
  }
}

// 2. Verkrijg alle leveranciers
export async function getSuppliersAction() {
  try {
    const session = await getSessionAction();
    if (!session.success || !session.user) {
      throw new Error('Niet geauthenticeerd');
    }

    const suppliers = await db.supplier.findMany({
      include: {
        products: true,
        orderLogs: {
          take: 10,
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { reliabilityScore: 'desc' }
    });

    return { success: true, data: suppliers };
  } catch (error: any) {
    console.error('Failed to get suppliers:', error);
    return { success: false, error: error.message };
  }
}

// 3. Prijsvergelijker actie voor alle SKU's of een specifieke SKU
export async function compareSupplierPricesAction(sku?: string) {
  try {
    const session = await getSessionAction();
    if (!session.success || !session.user) {
      throw new Error('Niet geauthenticeerd');
    }

    const whereClause = sku ? { sku } : {};

    const products = await db.supplierProduct.findMany({
      where: whereClause,
      include: {
        supplier: true
      },
      orderBy: {
        costPrice: 'asc'
      }
    });

    // Groepeer per SKU
    const comparison: Record<string, typeof products> = {};
    products.forEach(p => {
      if (!comparison[p.sku]) {
        comparison[p.sku] = [];
      }
      comparison[p.sku].push(p);
    });

    return { success: true, data: comparison };
  } catch (error: any) {
    console.error('Failed to compare supplier prices:', error);
    return { success: false, error: error.message };
  }
}

// 4. Verkrijg Profit Optimization Logs voor de charts
export async function getProfitOptimizationLogsAction(sku?: string) {
  try {
    const session = await getSessionAction();
    if (!session.success || !session.user) {
      throw new Error('Niet geauthenticeerd');
    }

    const where = sku ? { sku } : {};
    
    const logs = await db.profitOptimizationLog.findMany({
      where,
      orderBy: { createdAt: 'asc' }
    });

    return { success: true, data: logs };
  } catch (error: any) {
    console.error('Failed to get profit logs:', error);
    return { success: false, error: error.message };
  }
}

// 5. Dynamic Pricing Engine & Profit Optimizer algoritme
export async function runPriceOptimizerAction(sku: string, currentSellingPrice: number) {
  try {
    const session = await getSessionAction();
    if (!session.success || !session.user) {
      throw new Error('Niet geauthenticeerd');
    }

    // 1. Zoek de goedkoopste/beste leverancier prijs voor deze SKU
    const supplierProducts = await db.supplierProduct.findMany({
      where: { sku },
      include: { supplier: true },
      orderBy: { costPrice: 'asc' }
    });

    if (supplierProducts.length === 0) {
      throw new Error(`Geen leveranciers gevonden voor SKU ${sku}`);
    }

    // We filteren op leveranciers met een betrouwbaarheid > 80% of nemen de goedkoopste betrouwbare
    const bestSupplierProduct = supplierProducts.find(sp => sp.supplier.reliabilityScore >= 0.8) || supplierProducts[0];
    const costPrice = bestSupplierProduct.costPrice;

    // 2. Bereken sales velocity (verkopen per dag in de afgelopen 7 dagen)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Zoek naar orders met deze SKU
    const orders = await db.franchiseOrder.findMany({
      where: {
        createdAt: { gte: sevenDaysAgo },
        status: 'PAID'
      }
    });

    let totalQty = 0;
    orders.forEach(order => {
      try {
        const items = JSON.parse(order.items);
        if (Array.isArray(items)) {
          items.forEach((item: any) => {
            if (item.sku === sku || item.id === sku) {
              totalQty += item.quantity || 1;
            }
          });
        }
      } catch (e) {
        // Fout bij parsen, negeer
      }
    });

    const salesVelocity = totalQty / 7.0; // verkopen per dag

    // 3. Eerdere logs bekijken om elasticiteit te berekenen
    const previousLogs = await db.profitOptimizationLog.findMany({
      where: { sku },
      orderBy: { createdAt: 'desc' },
      take: 2
    });

    let elasticity = -1.5; // Standaard elasticiteit
    if (previousLogs.length >= 2) {
      const log1 = previousLogs[0]; // meest recent
      const log2 = previousLogs[1]; // ouder

      const deltaPrice = log1.sellingPrice - log2.sellingPrice;
      const deltaVelocity = log1.salesVelocity - log2.salesVelocity;

      if (deltaPrice !== 0 && log2.sellingPrice !== 0 && log2.salesVelocity !== 0) {
        const pctDeltaPrice = deltaPrice / log2.sellingPrice;
        const pctDeltaVelocity = deltaVelocity / log2.salesVelocity;
        
        // Elasticiteit = % verandering in velocity / % verandering in prijs
        // Moet normaal gesproken negatief zijn (prijs omhoog -> vraag omlaag)
        const calculatedElasticity = pctDeltaVelocity / pctDeltaPrice;
        
        if (!isNaN(calculatedElasticity) && isFinite(calculatedElasticity)) {
          // Begrens de elasticiteit tot realistische waarden (-5.0 tot -0.5)
          elasticity = Math.max(-5.0, Math.min(-0.5, calculatedElasticity));
        }
      }
    }

    // 4. Bereken de geoptimaliseerde prijs
    let optimizedPrice = currentSellingPrice;

    // Strategie gebaseerd op verkoop-velocity en elasticiteit:
    if (salesVelocity > 4.0) {
      // Hoge vraag! Verhoog de prijs om winst te maximaliseren
      const markup = Math.max(0.05, Math.min(0.20, Math.abs(1 / elasticity))); // elastischer = lagere markup stijging
      optimizedPrice = currentSellingPrice * (1 + markup);
    } else if (salesVelocity < 1.0) {
      // Lage vraag, verlaag de prijs om volume te stimuleren
      const discount = 0.08; 
      optimizedPrice = currentSellingPrice * (1 - discount);
      
      // Maar nooit onder Cost + 15% winstmarge
      const minPrice = costPrice * 1.15;
      if (optimizedPrice < minPrice) {
        optimizedPrice = minPrice;
      }
    } else {
      // Stabiele vraag, optimaliseer op basis van theoretische micro-economie (als E < -1)
      if (elasticity < -1) {
        const theoreticOpt = (elasticity / (1 + elasticity)) * costPrice;
        // Zachte demping (50% weging naar het theoretisch optimum)
        optimizedPrice = (currentSellingPrice + theoreticOpt) / 2;
      } else {
        // Geen stabile optimum mogelijk via elasticiteitsformule, doe een kleine verhoging
        optimizedPrice = currentSellingPrice * 1.02;
      }
      
      // Zorg voor minimale marge
      const minPrice = costPrice * 1.15;
      if (optimizedPrice < minPrice) {
        optimizedPrice = minPrice;
      }
    }

    // Afronden op 2 decimalen, en mooi eindigen op .90, .95 of .99 voor e-commerce conversie
    optimizedPrice = Math.round(optimizedPrice * 100) / 100;
    const base = Math.floor(optimizedPrice);
    const decimals = optimizedPrice - base;
    if (decimals > 0.85) {
      optimizedPrice = base + 0.99;
    } else if (decimals > 0.45) {
      optimizedPrice = base + 0.95;
    } else {
      optimizedPrice = base + 0.90;
    }

    // 5. Log de optimalisatie actie
    const profitMargin = optimizedPrice - costPrice;
    const log = await db.profitOptimizationLog.create({
      data: {
        sku,
        costPrice,
        sellingPrice: currentSellingPrice,
        profitMargin,
        salesVelocity,
        elasticity,
        optimizedPrice
      }
    });

    revalidatePath('/dashboard/franchises/intelligence');
    return { success: true, data: log };
  } catch (error: any) {
    console.error('Failed to run price optimizer:', error);
    return { success: false, error: error.message };
  }
}

// 6. Verwerk leverancier order simulatie bij een nieuwe franchise order
// Deze functie selecteert de beste leverancier en simuleert de fulfillment
export async function processSupplierOrderSimulation(
  orderId: string,
  franchiseId: string,
  items: any[]
) {
  try {
    const results = [];

    for (const item of items) {
      const sku = item.sku || item.id;
      
      // 1. Zoek de leveranciers die deze SKU verkopen
      const supplierProducts = await db.supplierProduct.findMany({
        where: { sku },
        include: { supplier: true }
      });

      if (supplierProducts.length === 0) {
        console.warn(`Geen leverancier gevonden voor SKU ${sku}`);
        continue;
      }

      // 2. Selecteer de beste leverancier op basis van weighted intelligence score:
      // We willen de goedkoopste prijs, maar ook een hoge betrouwbaarheidsscore.
      // Score = CostPrice / (ReliabilityScore^1.5)
      // Een lagere score is beter (goedkoper / betrouwbaarder)
      let bestProduct = supplierProducts[0];
      let bestScore = Infinity;

      supplierProducts.forEach(sp => {
        const reliability = Math.max(0.1, sp.supplier.reliabilityScore);
        const score = sp.costPrice / Math.pow(reliability, 1.5);
        if (score < bestScore) {
          bestScore = score;
          bestProduct = sp;
        }
      });

      const selectedSupplier = bestProduct.supplier;

      // 3. Simuleer de order fulfillment uitkomst op basis van de leveranciersstatistieken
      // Genereer succes (true/false) op basis van de successRate van de leverancier
      const rollSuccess = Math.random() <= selectedSupplier.successRate;
      
      // Genereer levertijd: gemiddelde levertijd + ruis (tussen -1.5 en +3 dagen)
      const noise = (Math.random() * 4.5) - 1.5;
      const deliveryTime = Math.max(0.5, selectedSupplier.avgDeliveryTime + noise);

      const status = rollSuccess ? 'DELIVERED' : 'FAILED';

      // 4. Maak de SupplierOrderLog aan
      const orderLog = await db.supplierOrderLog.create({
        data: {
          supplierId: selectedSupplier.id,
          orderId,
          status,
          deliveryTime: rollSuccess ? parseFloat(deliveryTime.toFixed(2)) : null,
          success: rollSuccess
        }
      });

      // 5. Update de leveranciersstatistieken live op basis van deze nieuwe ervaring!
      // We gebruiken een exponentieel voortschrijdend gemiddelde (weging 0.1 voor nieuwe data)
      const weight = 0.1;
      
      const newSuccessRate = (selectedSupplier.successRate * (1 - weight)) + ((rollSuccess ? 1 : 0) * weight);
      
      let newAvgDeliveryTime = selectedSupplier.avgDeliveryTime;
      if (rollSuccess) {
        newAvgDeliveryTime = (selectedSupplier.avgDeliveryTime * (1 - weight)) + (deliveryTime * weight);
      }

      // Herbereken de gecombineerde betrouwbaarheidsscore
      // Score = successRate * (5.0 / avgDeliveryTime) * (rating / 5.0) - begrensd op max 1.0
      // We normaliseren dit zachtjes
      const deliveryFactor = Math.min(1.5, 4.0 / newAvgDeliveryTime);
      const ratingFactor = selectedSupplier.rating / 5.0;
      const rawReliability = newSuccessRate * deliveryFactor * ratingFactor;
      const newReliabilityScore = Math.max(0.1, Math.min(1.0, rawReliability));

      await db.supplier.update({
        where: { id: selectedSupplier.id },
        data: {
          successRate: parseFloat(newSuccessRate.toFixed(4)),
          avgDeliveryTime: parseFloat(newAvgDeliveryTime.toFixed(2)),
          reliabilityScore: parseFloat(newReliabilityScore.toFixed(4))
        }
      });

      // Verminder voorraad van de leverancier met de bestelde hoeveelheid
      const newStock = Math.max(0, bestProduct.stock - (item.quantity || 1));
      await db.supplierProduct.update({
        where: { id: bestProduct.id },
        data: { stock: newStock }
      });

      // 6. Run de Dynamic Price Optimizer voor dit product, zodat de winkelprijs direct reageert op de velocity!
      // We gebruiken de voorgestelde retailprijs uit de order of een geschatte verkoopprijs
      const currentSellingPrice = item.price || bestProduct.suggestedRetailPrice || 89.00;
      await runPriceOptimizerAction(sku, currentSellingPrice);

      results.push({
        sku,
        supplierName: selectedSupplier.name,
        costPrice: bestProduct.costPrice,
        status,
        deliveryTime: rollSuccess ? deliveryTime : null
      });
    }

    revalidatePath('/dashboard/franchises/intelligence');
    return { success: true, data: results };
  } catch (error: any) {
    console.error('Failed to process supplier order simulation:', error);
    return { success: false, error: error.message };
  }
}
