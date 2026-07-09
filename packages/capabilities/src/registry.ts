import { getContext } from '@rebuildyourlife/security';

export interface ToolDefinition {
  name: string;
  description: string;
  requiredRole?: string; // Optionele role (uit IAM Fase 3)
  execute: (args: any) => Promise<any>;
}

export class ToolRegistry {
  private tools: Map<string, ToolDefinition> = new Map();

  /**
   * Registreert een nieuwe tool in de Capability Platform.
   */
  public registerTool(tool: ToolDefinition) {
    if (this.tools.has(tool.name)) {
      throw new Error(`[Capability Platform] Tool ${tool.name} is already registered.`);
    }
    this.tools.set(tool.name, tool);
    console.log(`[Capability Platform] Registered Tool: ${tool.name}`);
  }

  /**
   * Geeft een lijst van alle tools (optioneel gefilterd op permissies).
   */
  public getAvailableTools(): ToolDefinition[] {
    const context = getContext();
    const allTools = Array.from(this.tools.values());

    if (!context) {
      // Zonder context (bijv. systeem-init) geven we alles terug
      return allTools;
    }

    // Role-Based Access Control voor Tools!
    return allTools.filter(tool => {
      if (!tool.requiredRole) return true;
      return context.role === tool.requiredRole || context.role === 'SUPREME_OVERSEER';
    });
  }

  /**
   * Voert een tool uit, en valideert IAM rechten vóór executie.
   */
  public async executeTool(name: string, args: any): Promise<any> {
    const tool = this.tools.get(name);
    if (!tool) {
      throw new Error(`[Capability Platform] Tool ${name} not found.`);
    }

    const context = getContext();
    if (tool.requiredRole && context) {
      if (context.role !== tool.requiredRole && context.role !== 'SUPREME_OVERSEER') {
        throw new Error(`[Capability Platform] Access Denied: Executing ${name} requires ${tool.requiredRole}.`);
      }
    }

    return await tool.execute(args);
  }
}

// Exporteer een Singleton registry voor de hele backend
export const globalToolRegistry = new ToolRegistry();
