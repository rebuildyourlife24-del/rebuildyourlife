import { db as prisma } from './lib/db';

async function main() {
  console.log('Injecting TEST Swarm Actions...');
  
  const user = await prisma.user.findFirst();
  if (!user) {
    console.error('No users found to attach actions to.');
    return;
  }

  await prisma.agentAction.createMany({
    data: [
      {
        userId: user.id,
        agentType: 'HERMES',
        title: 'SWARM_TRAFFIC',
        description: '[Launch TikTok Ad Campaign] Orion detected a 400% surge in searches for "heated jackets". Allocating €250 budget to NL/BE.',
        payload: JSON.stringify({ productId: 'verwarmde-jas', budget: 250, regions: ['NL', 'BE'] }),
        status: 'PENDING',
      },
      {
        userId: user.id,
        agentType: 'HERMES',
        title: 'SWARM_SUPPLY',
        description: '[Fulfill VIP Order #10042] Customer ordered an Elite package. Triggering express fulfillment via CJ Dropshipping.',
        payload: JSON.stringify({ orderId: 'ORD-10042', productData: { sku: 'ELITE-01' }, customerAddress: { country: 'NL' } }),
        status: 'PENDING',
      },
      {
        userId: user.id,
        agentType: 'HERMES',
        title: 'SWARM_SUPPORT',
        description: '[Resolve Ticket: Shipping Delay] Customer is angry about shipping time. Genereren empathetic response & offering 10% discount.',
        payload: JSON.stringify({ ticketId: 'TCK-994', customerMessage: 'Waar blijft mijn pakket?!', language: 'NL' }),
        status: 'PENDING',
      },
      {
        userId: user.id,
        agentType: 'HERMES',
        title: 'SWARM_CONTENT',
        description: '[Generate German Landing Page] Expanding to DE market. Generating localized high-converting landing page for product X.',
        payload: JSON.stringify({ productUrl: 'https://rebuildyourlife.eu/nl/product-x', targetLanguage: 'DE' }),
        status: 'PENDING',
      }
    ]
  });
  
  console.log('Done!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
