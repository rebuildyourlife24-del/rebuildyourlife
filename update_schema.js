const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'packages', 'database', 'prisma', 'schema.prisma');
let schemaContent = fs.readFileSync(schemaPath, 'utf8');

// Insert reverse relations into the User model
const userModelRegex = /(model User \{[\s\S]*?)(?=\n\s*@@)/;
const reverseRelations = `
  // Universal OS Relations
  entitySchemas          EntitySchema[]          @relation("UserEntitySchemas")
  entityInstances        EntityInstance[]        @relation("UserEntityInstances")
  businessModels         BusinessModel[]         @relation("UserBusinessModels")
`;

if (schemaContent.match(userModelRegex)) {
    if (!schemaContent.includes('EntitySchema[]')) {
        schemaContent = schemaContent.replace(userModelRegex, `$1${reverseRelations}`);
    }
} else {
    console.error('Could not find User model block');
    process.exit(1);
}

// Append new models
const newModels = `
// =======================================================
// UNIVERSAL DATA LAYER (Headless PIM/CRM/CMS)
// =======================================================

model EntitySchema {
  id          String   @id @default(uuid())
  userId      String
  name        String
  description String?
  fields      Json     // Schema blueprint
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  user        User     @relation("UserEntitySchemas", fields: [userId], references: [id], onDelete: Cascade)
  instances   EntityInstance[]
  @@unique([userId, name])
}

model EntityInstance {
  id          String       @id @default(uuid())
  schemaId    String
  userId      String
  data        Json         // Actual dynamic data
  status      String       @default("ACTIVE")
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
  schema      EntitySchema @relation(fields: [schemaId], references: [id], onDelete: Cascade)
  user        User         @relation("UserEntityInstances", fields: [userId], references: [id], onDelete: Cascade)
  @@index([schemaId])
  @@index([userId])
}

// =======================================================
// UNIVERSAL REVENUE & BUSINESS MODEL ENGINE
// =======================================================

model BusinessModel {
  id              String   @id @default(uuid())
  userId          String
  name            String   // e.g. "SaaS Tier 1", "E-book One-Off", "Consulting Hourly"
  type            String   // SUBSCRIPTION, ONE_TIME, USAGE_BASED, COMMISSION, ROYALTY, MARKETPLACE
  pricingStrategy String   // FLAT_RATE, TIERED, PER_UNIT, REVENUE_SHARE
  currency        String   @default("EUR")
  basePrice       Float    @default(0)
  billingCycle    String?  // MONTHLY, YEARLY, WEEKLY (if subscription)
  commissionRate  Float?   // Percentage (if affiliate/marketplace)
  metadata        Json?    // Specific limits or rules
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  user            User     @relation("UserBusinessModels", fields: [userId], references: [id], onDelete: Cascade)
  transactions    UniversalTransaction[]
  subscriptions   UniversalSubscription[]
}

model UniversalTransaction {
  id              String        @id @default(uuid())
  modelId         String
  userId          String?       // The owner of the business model
  customerId      String?       // The buyer (can be mapped to a User ID or EntityInstance ID)
  amount          Float
  currency        String        @default("EUR")
  status          String        @default("PENDING") // PENDING, PAID, REFUNDED, FAILED
  paymentProvider String?       // STRIPE, MOLLIE, PAYPAL, CRYPTO
  providerTxId    String?
  metadata        Json?         // E.g., which EntityInstance was bought
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  model           BusinessModel @relation(fields: [modelId], references: [id])
}

model UniversalSubscription {
  id              String        @id @default(uuid())
  modelId         String
  userId          String?
  customerId      String?
  status          String        @default("ACTIVE") // ACTIVE, CANCELED, PAST_DUE
  currentPeriodEnd DateTime
  cancelAtPeriodEnd Boolean     @default(false)
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  model           BusinessModel @relation(fields: [modelId], references: [id])
}
`;

if (!schemaContent.includes('model EntitySchema')) {
    schemaContent += newModels;
}

fs.writeFileSync(schemaPath, schemaContent, 'utf8');
console.log('Schema updated successfully!');
