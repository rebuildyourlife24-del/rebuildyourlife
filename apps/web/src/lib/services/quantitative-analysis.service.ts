export class QuantitativeAnalysisService {
  /**
   * Linear Regression: Berekent de wiskundige hellingshoek (trend) van data.
   * Positieve slope = Groei. Negatieve slope = Krimp.
   */
  static calculateTrend(data: number[]): { slope: number, trend: 'UPWARD' | 'DOWNWARD' | 'STAGNANT' } {
    if (data.length < 2) return { slope: 0, trend: 'STAGNANT' };
    
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    const n = data.length;

    for (let i = 0; i < n; i++) {
      sumX += i;
      sumY += data[i];
      sumXY += i * data[i];
      sumX2 += i * i;
    }

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    
    // We gebruiken een kleine threshold om stagnatie te definiëren
    let trend: 'UPWARD' | 'DOWNWARD' | 'STAGNANT' = 'STAGNANT';
    if (slope > 0.05) trend = 'UPWARD';
    if (slope < -0.05) trend = 'DOWNWARD';

    return { slope, trend };
  }

  /**
   * Standard Deviation: Berekent of de meest recente waarde een statistische afwijking is.
   * Retourneert true als de laatste waarde meer dan 2 standaarddeviaties afwijkt van het gemiddelde.
   */
  static detectAnomaly(data: number[]): boolean {
    if (data.length < 5) return false;

    const recentValue = data[data.length - 1];
    const historicalData = data.slice(0, -1);
    
    const mean = historicalData.reduce((a, b) => a + b, 0) / historicalData.length;
    
    const squareDiffs = historicalData.map(val => Math.pow(val - mean, 2));
    const variance = squareDiffs.reduce((a, b) => a + b, 0) / historicalData.length;
    const stdDev = Math.sqrt(variance);

    // Z-Score > 2 (of < -2) wordt gezien als een statistische anomalie
    const zScore = Math.abs((recentValue - mean) / (stdDev || 1));
    return zScore > 2;
  }

  /**
   * Monte Carlo Simulatie: Simuleert 1000 iteraties op basis van de huidige volatiliteit
   * om de verwachte inkomsten voor de komende X dagen te berekenen.
   */
  static runMonteCarloForecast(data: number[], daysToForecast: number = 7): { expected: number, min: number, max: number } {
    if (data.length < 3) return { expected: 0, min: 0, max: 0 };

    const mean = data.reduce((a, b) => a + b, 0) / data.length;
    const squareDiffs = data.map(val => Math.pow(val - mean, 2));
    const stdDev = Math.sqrt(squareDiffs.reduce((a, b) => a + b, 0) / data.length);

    let totalExpected = 0;
    const iterations = 1000;
    const finalResults = [];

    for (let i = 0; i < iterations; i++) {
      let simTotal = 0;
      for (let day = 0; day < daysToForecast; day++) {
        // Random normal distribution using Box-Muller transform
        const u = 1 - Math.random();
        const v = Math.random();
        const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        
        const simulatedDailyValue = Math.max(0, mean + z * stdDev);
        simTotal += simulatedDailyValue;
      }
      finalResults.push(simTotal);
      totalExpected += simTotal;
    }

    finalResults.sort((a, b) => a - b);
    const expected = totalExpected / iterations;
    const min = finalResults[Math.floor(iterations * 0.05)]; // 5th percentile
    const max = finalResults[Math.floor(iterations * 0.95)]; // 95th percentile

    return { expected, min, max };
  }
}
