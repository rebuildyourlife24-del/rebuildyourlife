import { HermesPrediction } from '../contracts/hermes/prediction';

export class HermesAdapter {
  static async createPrediction(data: Omit<HermesPrediction, 'id' | 'createdAt'>): Promise<HermesPrediction> {
    console.log('[ADAPTER] Mocking createPrediction');
    return { ...data, id: 'pred_' + Date.now(), createdAt: new Date() };
  }
}
