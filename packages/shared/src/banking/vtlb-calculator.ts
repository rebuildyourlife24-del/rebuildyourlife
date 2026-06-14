/**
 * VTLB (Vrij Te Laten Bedrag) Calculator
 * OMEGA PROTOCOL - Recht-Door-Zee Backend
 * 
 * Berekent het wettelijk minimum waar schuldeisers NIET aan mogen komen.
 */

export interface VTLBParameters {
  netIncome: number;
  livingSituation: 'SINGLE' | 'MARRIED' | 'SINGLE_PARENT';
  housingCost: number; // Huur of hypotheek
  healthInsuranceCost: number;
  hasChildren: boolean;
}

export interface VTLBResult {
  vtlbAmount: number;
  seizableAmount: number; // Wat schuldeisers mogen pakken (Beslagvrije voet overschrijding)
  baseNorm: number;
  housingCorrection: number;
  healthInsuranceCorrection: number;
}

export class VTLBCalculator {
  // Wettelijke normen (bij benadering voor 2026)
  private static readonly NORMS = {
    SINGLE: 1283.83,
    MARRIED: 1834.04,
    SINGLE_PARENT: 1283.83, // Vaak gelijk aan single, maar met kindgebonden budget correcties in praktijk
  };

  private static readonly NOMINAL_HEALTH_PREMIUM = 175.00; // Gemiddelde nominale premie
  private static readonly STANDARD_HOUSING_COST = 250.00; // Deel van huurtoeslag drempel

  /**
   * Berekent de beslagvrije voet / VTLB.
   */
  public static calculate(params: VTLBParameters): VTLBResult {
    const baseNorm = this.NORMS[params.livingSituation];

    // Correctie Woonlasten: Alles boven de standaard woonnorm verhoogt het VTLB (tot een max)
    const housingCorrection = Math.max(0, params.housingCost - this.STANDARD_HOUSING_COST);

    // Correctie Ziektekosten
    const healthInsuranceCorrection = Math.max(0, params.healthInsuranceCost - this.NOMINAL_HEALTH_PREMIUM);

    // Het VTLB is de basisnorm + correcties (in het echt is de rekensom veel complexer met toeslagen)
    let vtlbAmount = baseNorm + housingCorrection + healthInsuranceCorrection;

    // VTLB mag nooit hoger zijn dan 95% van het netto inkomen als veiligheidsmarge in deze versimpelde versie
    if (vtlbAmount > params.netIncome) {
      vtlbAmount = params.netIncome * 0.95; // Laat altijd 5% over voor de schuldeiser
    }

    // Wat de schuldeisers mogen pakken is wat er over is ná het VTLB
    const seizableAmount = Math.max(0, params.netIncome - vtlbAmount);

    return {
      vtlbAmount: Number(vtlbAmount.toFixed(2)),
      seizableAmount: Number(seizableAmount.toFixed(2)),
      baseNorm,
      housingCorrection,
      healthInsuranceCorrection
    };
  }
}
