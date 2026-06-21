/**
 * THE SENTINEL (Phase 15.2)
 * Native Cyber-Security Agent voor The Godbrain (Orion).
 * 
 * Doel: Voordat Orion of een sub-agent (zoals een Klantenservice Agent) een 
 * externe link opent of een actie uitvoert op het 'open internet', 
 * moet The Sentinel het goedkeuren. Dit is de militaire Cloud Firewall.
 */

interface SentinelReport {
  isSafe: boolean;
  threatLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  reason?: string;
}

export class Sentinel {
  
  // Scant inkomende data op heuristische patronen van malware/phishing
  static async scanUrl(url: string): Promise<SentinelReport> {
    console.log(`[THE SENTINEL] Scanning URL for threats: ${url}`);
    
    // Zwarte lijst van bekende malafide domeinen (Native Database Guard)
    const blacklistDomains = ['.ru', '.onion', 'free-crypto', 'hack'];
    const isBlacklisted = blacklistDomains.some(domain => url.includes(domain));

    if (isBlacklisted) {
      return {
        isSafe: false,
        threatLevel: 'CRITICAL',
        reason: 'Domein komt voor in de Sentinel Blacklist.'
      };
    }

    // Heuristische URL lengte/karakter check (vaak gebruikt voor injecties)
    if (url.length > 500 || url.includes('<script>')) {
      return {
        isSafe: false,
        threatLevel: 'HIGH',
        reason: 'Verdachte URL structuur of XSS-injectie gedetecteerd.'
      };
    }

    // Gesimuleerde "Cloud Ping" naar een externe virusscanner (zoals VirusTotal)
    const externalCheckPassed = await this.simulateExternalAPI(url);
    if (!externalCheckPassed) {
      return {
        isSafe: false,
        threatLevel: 'HIGH',
        reason: 'Geblokkeerd door externe Virus Database.'
      };
    }

    return {
      isSafe: true,
      threatLevel: 'LOW'
    };
  }

  // Controleert prompts of documenten die klanten uploaden
  static async scanDocument(content: string): Promise<SentinelReport> {
    const maliciousKeywords = ['DROP TABLE', 'EXEC(', 'eval(', 'document.cookie'];
    
    const containsMalware = maliciousKeywords.some(keyword => content.includes(keyword));
    
    if (containsMalware) {
      return {
        isSafe: false,
        threatLevel: 'CRITICAL',
        reason: 'Mogelijke SQL of Code Injection gedetecteerd in klantdocument.'
      };
    }

    return { isSafe: true, threatLevel: 'LOW' };
  }

  private static async simulateExternalAPI(url: string): Promise<boolean> {
    return new Promise((resolve) => setTimeout(() => resolve(true), 150));
  }
}
