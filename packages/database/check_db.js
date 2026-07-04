const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Verbinding maken met de online database...');
    await prisma.$connect();
    console.log('Database verbinding succesvol. De database is online en bereikbaar.');
    
    // Probeer een query uit te voeren om te bewijzen dat we erin zitten
    const userCount = await prisma.user.count();
    console.log(`Er zijn momenteel ${userCount} geregistreerde gebruikers in de database.`);
    
    const postCount = await prisma.socialMediaPost.count();
    console.log(`Er staan momenteel ${postCount} gegenereerde scripts/posts in de database.`);
    
  } catch(e) {
    console.error('Fout bij het verbinden met de database:', e);
  } finally {
    await prisma.$disconnect();
  }
}
main();
