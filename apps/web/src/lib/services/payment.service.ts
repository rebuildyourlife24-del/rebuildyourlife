import { prisma } from '@rebuildyourlife/database';

export class PaymentRouterService {
  /**
   * Bepaalt dynamisch de betaalprovider o.b.v. het land van de bezoeker.
   * Europa (NL, BE, DE, FR) -> Mollie (iDEAL, Bancontact, SEPA)
   * Rest van de Wereld (US, UK, AU, etc) -> Stripe (Creditcard, Apple Pay)
   */
  static async getCheckoutUrl(userId: string, amount: number, currency: string, countryCode: string, description: string) {
    const isEurope = ['NL', 'BE', 'DE', 'FR', 'ES', 'IT', 'AT'].includes(countryCode.toUpperCase());

    if (isEurope) {
      // Gebruik Mollie
      return await this.createMollieCheckout(userId, amount, currency, description);
    } else {
      // Gebruik Stripe (Global)
      return await this.createStripeCheckout(userId, amount, currency, description);
    }
  }

  private static async createMollieCheckout(userId: string, amount: number, currency: string, description: string) {
    // In werkelijkheid zou hier de @mollie/api-client zitten.
    console.log(`[MOLLIE] Creating €${amount} checkout for ${userId}`);
    return `https://www.mollie.com/checkout/test_${Math.random().toString(36).substring(7)}`;
  }

  private static async createStripeCheckout(userId: string, amount: number, currency: string, description: string) {
    // Controleer of de klant Stripe heeft gekoppeld via de Integrations UI
    const stripeConfig = await prisma.apiIntegration.findUnique({
      where: { userId_provider: { userId, provider: 'STRIPE_API' } }
    });

    if (!stripeConfig || !stripeConfig.apiKey) {
      console.warn('Geen Stripe API key gevonden. Fallback naar Mollie.');
      return await this.createMollieCheckout(userId, amount, currency, description);
    }

    // In werkelijkheid zou hier stripe.checkout.sessions.create zitten.
    console.log(`[STRIPE GLOBAL] Creating ${currency} ${amount} checkout for ${userId}`);
    return `https://checkout.stripe.com/pay/test_${Math.random().toString(36).substring(7)}`;
  }
}
