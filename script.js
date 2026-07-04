const fs = require('fs');
let c = fs.readFileSync('packages/database/prisma/schema.prisma', 'utf8');
c = c.replace(/model ShopifyOrder \{[\s\S]*?@@index\(\[storeId\]\)\r?\n\}/, `model ShopifyOrder {
  id             String   @id @default(uuid())
  storeId        String
  shopifyOrderId String   @unique
  orderNumber    String?
  totalPrice     Float
  currency       String?
  status         String   @default("PENDING")
  customerEmail  String?
  orderedAt      DateTime @default(now())
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  store          ShopifyStore @relation(fields: [storeId], references: [id], onDelete: Cascade)

  @@index([storeId])
}`);
fs.writeFileSync('packages/database/prisma/schema.prisma', c);
