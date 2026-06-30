import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = "hsemler50@gmail.com";
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    console.error(`User ${email} not found!`);
    process.exit(1);
  }

  console.log(`Activating Social Media for user: ${email} (${user.id})`);

  // Inject Social Platform Integration
  await prisma.socialPlatformIntegration.create({
    data: {
      userId: user.id,
      platform: 'INSTAGRAM',
      accountId: 'rebuildyoulife24',
      accessToken: 'Henksemler123!',
      status: 'CONNECTED'
    }
  }).catch(async (e) => {
    // If it exists but we don't have a unique constraint on userId+platform, let's just delete and recreate
    await prisma.socialPlatformIntegration.deleteMany({
      where: { userId: user.id, platform: 'INSTAGRAM' }
    });
    await prisma.socialPlatformIntegration.create({
      data: {
        userId: user.id,
        platform: 'INSTAGRAM',
        accountId: 'rebuildyoulife24',
        accessToken: 'Henksemler123!',
        status: 'CONNECTED'
      }
    });
  });

  console.log('[+] SocialPlatformIntegration connected for Instagram (rebuildyoulife24)!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
