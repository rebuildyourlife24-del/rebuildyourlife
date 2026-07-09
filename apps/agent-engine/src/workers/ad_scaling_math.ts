/**
 * Multi-Channel Ad Scaling Engine & Channel Prioritization Matrix
 * 
 * Verantwoordelijk voor het veilig opschalen van advertentiebudgetten
 * volgens de AEIP Revenue Intelligence logica en de Top-2 kanaal-matrix.
 */

// De 5 Strategische Categorieën en hun Top-2 Testkanalen
export const CHANNEL_MATRIX = {
  SAAS_B2B: ["LINKEDIN", "GOOGLE_SEARCH"],
  ECOMMERCE: ["TIKTOK", "META"],
  CONTENT_MEDIA: ["TIKTOK", "YOUTUBE_SHORTS"],
  SERVICES_LOCAL: ["GOOGLE_BUSINESS", "GOOGLE_SEARCH_LOCAL"],
  AFFILIATE_LEADGEN: ["SEO", "EMAIL"]
} as const;

export type Category = keyof typeof CHANNEL_MATRIX;

/**
 * Berekent het startbudget gebaseerd op het Target CPA.
 * Dwingt platform-specifieke minimumbudgetten af.
 */
export function calculateStartingBudget(channel: string, targetCpa: number): number {
  let startingBudget = targetCpa * 3; // Standaard: 3x CPA regel

  // Platform specifieke limieten
  if (channel === "TIKTOK" && startingBudget < 50) {
    return 50; // TikTok eist officieel $20/ad-group, maar voor testing is minimaal $50 aanbevolen om uit de learning phase te komen.
  }
  
  if (channel === "META" && startingBudget < 30) {
    return 30; // Meta heeft officieel $1 minimum, maar <$30 leidt tot data-woestijn.
  }

  return startingBudget;
}

/**
 * Evalueert of we moeten schalen, bevriezen, of killen gebaseerd op actuele prestaties.
 * Deze functie wordt aangeroepen door de BMF worker (elke 72 uur).
 */
export function evaluateAdPerformance(
  currentDailyBudget: number,
  currentCpa: number,
  breakEvenCpa: number,
  targetRoas: number,
  actualRoas: number
): { action: "SCALE" | "HOLD" | "CAP" | "KILL", newBudget: number, reason: string } {
  
  // 1. Zware Verliezer: Direct uitschakelen
  if (currentCpa > breakEvenCpa) {
    return {
      action: "KILL",
      newBudget: 0,
      reason: "Huidige CPA overschrijdt de Break-Even CPA. Campagne maakt direct verlies."
    };
  }

  // 2. Afnemende Meeropbrengst (Diminishing Returns) / De 80% Ceiling
  if (currentCpa >= (breakEvenCpa * 0.8)) {
    return {
      action: "CAP",
      newBudget: currentDailyBudget, // Budget wordt bevroren (niet meer opschalen)
      reason: "Huidige CPA zit op 80% van Break-Even (Sweet Spot bereikt). Budget wordt bevroren om marge te beschermen."
    };
  }

  // 3. Winstgevend & Ruimte om te schalen (De 72-uur +15% regel)
  if (actualRoas >= targetRoas) {
    const scaledBudget = parseFloat((currentDailyBudget * 1.15).toFixed(2));
    return {
      action: "SCALE",
      newBudget: scaledBudget,
      reason: `ROAS (${actualRoas}) is hoger dan Target (${targetRoas}). Budget met 15% verhoogd naar ${scaledBudget}.`
    };
  }

  // 4. Neutraal (Nog aan het leren of net onder Target ROAS, maar nog wel onder 80% CPA limiet)
  return {
    action: "HOLD",
    newBudget: currentDailyBudget,
    reason: "Performance is neutraal/stabiel. Budget blijft ongewijzigd om de Learning Phase te respecteren."
  };
}
