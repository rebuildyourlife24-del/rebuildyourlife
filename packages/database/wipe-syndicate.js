const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Wiping all Syndicate Posts, Comments, and Likes...");
  
  await prisma.syndicateLike.deleteMany({});
  await prisma.syndicateComment.deleteMany({});
  await prisma.syndicatePost.deleteMany({});
  
  console.log("✅ Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
