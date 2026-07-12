import { EvolutionChangeSpecification } from '../contracts/evolution/change-specification';
import { SandboxExecution } from '../contracts/evolution/sandbox-execution';
import { ValidationEvidence } from '../contracts/evolution/validation-evidence';
import { HermesEvolutionProposal } from '../contracts/hermes/proposal';

export class EvolutionAdapter {
  static async createSpecification(data: Omit<EvolutionChangeSpecification, 'id' | 'createdAt'>): Promise<EvolutionChangeSpecification> {
    console.log('[ADAPTER] Mocking createSpecification');
    return { ...data, id: 'spec_' + Date.now(), createdAt: new Date() };
  }
  static async updateProposalStatus(proposalId: string, status: HermesEvolutionProposal['status']) {
    console.log(`[ADAPTER] Mocking updateProposalStatus: ${proposalId} -> ${status}`);
  }
  static async getSpecification(id: string): Promise<EvolutionChangeSpecification> {
    console.log('[ADAPTER] Mocking getSpecification');
    return { id, proposalId: 'prop_1', description: 'Mock', riskTier: 'LOW', expectedImpact: 'Mock', validationCriteria: [], createdAt: new Date() };
  }
  static async createSandboxExecution(data: Omit<SandboxExecution, 'id' | 'createdAt'>): Promise<SandboxExecution> {
    console.log('[ADAPTER] Mocking createSandboxExecution');
    return { ...data, id: 'exec_' + Date.now(), createdAt: new Date() };
  }
  static async createValidationEvidence(data: Omit<ValidationEvidence, 'id' | 'createdAt'>): Promise<ValidationEvidence> {
    console.log('[ADAPTER] Mocking createValidationEvidence');
    return { ...data, id: 'evid_' + Date.now(), createdAt: new Date() };
  }
}
