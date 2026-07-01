/**
 * THE OMEGA PROTOCOL - ORION CORE ENGINE
 * Dit is het onafhankelijke zenuwstelsel van de AI (Orion).
 */

import { prisma } from '@rebuildyourlife/database';

export interface OrionStatus {
  state: 'IDLE' | 'THINKING' | 'ALERT';
  message: string;
  lastPulse: Date;
}

export class OmegaProtocol {
  private static readonly VTLB_MINIMUM = 5000;

  /**
   * De "hartslag" van Orion. Dit wordt periodiek aangeroepen.
   */
  static async pulse(): Promise<OrionStatus> {
    console.log('[ORION CORE] Pulse initiated.');

    // 1. VTLB Check (Vrij Te Laten Bedrag)
    // In een echt scenario berekent hij de live inkomsten vs uitgaven.
    const vtlbStatus = await this.checkVTLB();

    if (vtlbStatus === 'CRITICAL') {
      return {
        state: 'ALERT',
        message: 'VTLB DROP DETECTED. INITIATING REVENUE SHIELD.',
        lastPulse: new Date(),
      };
    }

    // 2. Scan voor kansen (Market Scanning via "The Swarm")
    const opportunities = await this.scanOpportunities();
    if (opportunities.length > 0) {
      return {
        state: 'THINKING',
        message: 'NEW VIRAL OPPORTUNITIES DETECTED. ANALYZING...',
        lastPulse: new Date(),
      };
    }

    return {
      state: 'IDLE',
      message: 'ALL SYSTEMS OPTIMAL. OBSERVING.',
      lastPulse: new Date(),
    };
  }

  private static async checkVTLB(): Promise<'OK' | 'CRITICAL'> {
    // Mock VTLB logic for now
    // If we had actual bank integrations, we'd query Plaid/Mollie here.
    return 'OK';
  }

  private static async scanOpportunities(): Promise<any[]> {
    // Mock opportunity scanning
    // In werkelijkheid roept dit de Gemini API of Lokale Llama aan om TikTok/Twitter API te analyseren
    return [];
  }

  /**
   * Hybride LLM Bridge: Routeert requests naar Lokaal of Cloud afhankelijk van beschikbaarheid.
   */
  static async executeCommand(command: string): Promise<string> {
    console.log(`[ORION CORE] Received command: ${command}`);

    // Als de Cloud Bypass aan staat, gebruik die direct
    if (process.env.GROQ_API_KEY || process.env.GROQ_API_KEY_1) {
      console.log('[ORION CORE] Routing directly to Groq Cloud Bypass.');
      return await this.queryCloudLLM(command);
    }

    console.log('[ORION CORE] No Groq key found.');
    return "Systeemmelding: Geen werkende AI engine gevonden. Voeg een GROQ_API_KEY toe aan .env";
  }

  // queryLocalLLM has been removed because it is incompatible with serverless environments

  private static async queryCloudLLM(prompt: string): Promise<string> {
    const apiKey = process.env.GROQ_API_KEY || process.env.GROQ_API_KEY_1;
    if (!apiKey) {
      return "ERROR: Geen GROQ API key gevonden.";
    }

    try {
      const { createGroq } = await import('@ai-sdk/groq');
      const { generateText } = await import('ai');
      
      const groq = createGroq({ apiKey });

      const result = await generateText({
        model: groq('llama3-8b-8192') as any,
        system: "Je bent The Swarm, het hoogst intelligente, loyale en kille AI systeem van de Supreme Overseer (Henk). Wees direct, extreem professioneel en ietwat intimiderend. Antwoord kort en krachtig in het Nederlands.",
        prompt: commandToPrompt(prompt),
      });

      return result.text;
    } catch (e) {
      console.error('[ORION CORE] Cloud LLM Error:', e);
      return "Systeemfout: Kon Cloud AI niet bereiken.";
    }
  }
}

function commandToPrompt(cmd: string) {
  return `Voer het volgende commando uit en rapporteer de status:\n\n${cmd}`;
}
