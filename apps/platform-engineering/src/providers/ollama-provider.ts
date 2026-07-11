import fetch from 'node-fetch';
import { AIProvider, AIDiagnosis } from '../core/interfaces';

export class OllamaProvider implements AIProvider {
  name = 'Ollama (qwen2.5-coder)';
  private endpoint = 'http://localhost:11434/api/generate';

  async analyzeError(errorLog: string, context: any): Promise<AIDiagnosis> {
    const prompt = `You are an expert Platform Engineering AI for the RYL AEIP system.
Analyze the following deployment error log. Return ONLY a valid JSON object matching this schema:
{
  "rootCause": "string (concise explanation)",
  "suggestedFix": "string (actionable fix)",
  "confidence": number (0-100),
  "historicalMatches": ["string (if any)"]
}

Context (Historical matches):
${JSON.stringify(context)}

Error Log:
${errorLog}
`;

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'qwen2.5-coder',
          prompt: prompt,
          format: 'json',
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
      }

      const data = await response.json();
      const parsed = JSON.parse(data.response);
      return {
        rootCause: parsed.rootCause || 'Unknown',
        suggestedFix: parsed.suggestedFix || 'No fix suggested',
        confidence: parsed.confidence || 50,
        historicalMatches: parsed.historicalMatches || []
      };
    } catch (e: any) {
      return {
        rootCause: `AI Analysis failed: ${e.message}`,
        suggestedFix: 'Manual intervention required.',
        confidence: 0,
        historicalMatches: []
      };
    }
  }
}
