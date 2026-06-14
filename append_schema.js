const fs = require('fs');
const schema = `
// ==========================================
// PHASE 3: EMPIRE EXPANSION (THE SWARM)
// ==========================================

model AgentDossier {
  id              String   @id @default(uuid())
  agentType       String   // e.g. 'SOCIAL_MEDIA', 'SHOPIFY_BUILDER'
  action          String
  target          String?
  status          String   @default("SUCCESS")
  details         String?  @db.Text
  timestamp       DateTime @default(now())
  
  userId          String?
  user            User?    @relation(fields: [userId], references: [id])
  
  @@index([agentType])
  @@index([userId])
  @@index([timestamp])
}

model ShopifyStore {
  id              String   @id @default(uuid())
  userId          String
  shopUrl         String
  accessToken     String
  status          String   @default("ACTIVE")
  totalRevenue    Float    @default(0)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  products        ShopifyProduct[]
  
  @@unique([userId, shopUrl])
  @@index([userId])
}

model ShopifyProduct {
  id              String   @id @default(uuid())
  storeId         String
  shopifyId       String   @unique
  title           String
  description     String?  @db.Text
  price           Float
  margin          Float?
  status          String   @default("DRAFT") // DRAFT -> PENDING_APPROVAL -> ACTIVE
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  store           ShopifyStore @relation(fields: [storeId], references: [id], onDelete: Cascade)
  
  @@index([storeId])
  @@index([status])
}

model SocialMediaPost {
  id              String   @id @default(uuid())
  userId          String
  platform        String   // 'TIKTOK', 'INSTAGRAM', 'X'
  content         String   @db.Text
  mediaUrl        String?
  status          String   @default("SCHEDULED") // SCHEDULED, PUBLISHED, FAILED
  publishAt       DateTime
  views           Int      @default(0)
  engagement      Float    @default(0)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
  @@index([platform])
  @@index([status])
}

model InterceptionAlert {
  id              String   @id @default(uuid())
  targetUserId    String
  triggerType     String   // 'HIGH_REVENUE', 'VIRAL_PRODUCT', 'CASHFLOW_ISSUE'
  metrics         String   @db.Text // JSON string of metrics
  status          String   @default("UNREAD") // UNREAD, INVESTIGATING, INTERCEPTED
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  targetUser      User     @relation("TargetedUser", fields: [targetUserId], references: [id])
  
  @@index([targetUserId])
  @@index([status])
  @@index([triggerType])
}
`;

fs.appendFileSync('packages/database/prisma/schema.prisma', schema);
console.log('Appended successfully');
