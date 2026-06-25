const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Creating SyndicatePost table...');
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "SyndicatePost" (
      "id" TEXT NOT NULL,
      "title" TEXT,
      "content" TEXT NOT NULL,
      "tier" INTEGER NOT NULL DEFAULT 1,
      "authorId" TEXT NOT NULL,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL,
      CONSTRAINT "SyndicatePost_pkey" PRIMARY KEY ("id"),
      CONSTRAINT "SyndicatePost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
    );
  `);

  console.log('Creating SyndicateComment table...');
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "SyndicateComment" (
      "id" TEXT NOT NULL,
      "content" TEXT NOT NULL,
      "postId" TEXT NOT NULL,
      "authorId" TEXT NOT NULL,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL,
      CONSTRAINT "SyndicateComment_pkey" PRIMARY KEY ("id"),
      CONSTRAINT "SyndicateComment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "SyndicatePost"("id") ON DELETE CASCADE ON UPDATE CASCADE,
      CONSTRAINT "SyndicateComment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
    );
  `);

  console.log('Creating SyndicateLike table...');
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "SyndicateLike" (
      "postId" TEXT NOT NULL,
      "userId" TEXT NOT NULL,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "SyndicateLike_pkey" PRIMARY KEY ("postId", "userId"),
      CONSTRAINT "SyndicateLike_postId_fkey" FOREIGN KEY ("postId") REFERENCES "SyndicatePost"("id") ON DELETE CASCADE ON UPDATE CASCADE,
      CONSTRAINT "SyndicateLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
    );
  `);

  console.log('Creating Indexes...');
  await prisma.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS "SyndicatePost_authorId_idx" ON "SyndicatePost"("authorId");');
  await prisma.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS "SyndicatePost_tier_idx" ON "SyndicatePost"("tier");');
  await prisma.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS "SyndicatePost_createdAt_idx" ON "SyndicatePost"("createdAt");');
  await prisma.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS "SyndicateComment_postId_idx" ON "SyndicateComment"("postId");');
  await prisma.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS "SyndicateComment_authorId_idx" ON "SyndicateComment"("authorId");');
  await prisma.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS "SyndicateLike_postId_idx" ON "SyndicateLike"("postId");');
  await prisma.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS "SyndicateLike_userId_idx" ON "SyndicateLike"("userId");');

  console.log('Done creating tables!');
  
  const tables = await prisma.$queryRaw`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name LIKE 'Syndicate%'
    ORDER BY table_name;
  `;
  console.log('Syndicate tables in database:', tables);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
