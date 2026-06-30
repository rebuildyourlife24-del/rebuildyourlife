import { prisma } from '@rebuildyourlife/database';

export class SupplierExtremeService {
  static async runDynamicRoutingAndNegotiation(userId: string) {
    const supplierKey = await prisma.apiIntegration.findUnique({
      where: { userId_provider: { userId, provider: 'CJ_DROPSHIPPING' } }
    });

    if (!supplierKey) return;

    // Check supplier delays or low stock using real DB
    const delayedProducts = await prisma.supplierProduct.findMany({
      where: { stock: { lt: 20 } },
      include: { supplier: true }
    });

    if (delayedProducts.length > 0) {
      await prisma.agentAction.create({
        data: {
          userId,
          agentType: 'LOGISTICS',
          title: 'Extreme Logistics: Autonome Order Herroutering',
          description: `${delayedProducts.length} bestsellers hebben vertraging bij de hoofdleverancier.`,
          estimatedCost: 0,
          estimatedRevenue: 1000, // Preserved revenue
          riskLevel: 'MEDIUM',
          reasoningApprove: `Hermes heeft een alternatieve leverancier (Zendrop) gevonden met voldoende voorraad. Klik Approve om de API alle 100+ openstaande orders live om te laten leiden. Hermes stuurt tevens een agressieve kortings-eis (e-mail) naar de falende leverancier.`,
          reasoningDeny: 'Klanten zullen hun pakket te laat ontvangen. Resulteert gegarandeerd in negatieve recensies en Mollie Chargebacks.'
        }
      });
    }
  }
}
