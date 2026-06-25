const fs = require('fs');
const path = require('path');

const filesToFix = [
  "apps/web/src/app/actions/aiChat.ts",
  "apps/web/src/app/actions/cfo.ts",
  "apps/web/src/app/actions/dashboard.ts",
  "apps/web/src/app/actions/dashboardData.ts",
  "apps/web/src/app/actions/featureFlags.ts",
  "apps/web/src/app/actions/passwordReset.ts",
  "apps/web/src/app/actions/payments.ts",
  "apps/web/src/app/actions/salesCloser.ts",
  "apps/web/src/app/actions/warRoomData.ts",
  "apps/web/src/app/api/mollie/checkout/route.ts",
  "apps/web/src/app/api/mollie/webhook/route.ts",
  "apps/web/src/app/auth/callback/route.ts",
  "apps/web/src/lib/orion/economy-loop.ts",
  "apps/web/src/lib/orion/neo-bank.ts",
  "apps/web/src/lib/services/cfo.service.ts",
  "apps/web/src/lib/services/concierge.service.ts",
  "apps/web/src/lib/services/luxury-receiver.service.ts",
  "apps/web/src/lib/services/opportunity.service.ts",
  "apps/web/src/lib/services/shopify.service.ts",
  "apps/web/src/lib/services/social.service.ts"
];

const basePath = path.join(__dirname, "apps", "web", "src");

filesToFix.forEach(relPath => {
  const fullPath = path.join(__dirname, relPath);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Replace the import
    content = content.replace(/import\s+{\s*PrismaClient\s*}\s+from\s+["']@rebuildyourlife\/database["'];?/g, 'import { prisma } from "@rebuildyourlife/database";');
    
    // Remove the instantiation
    content = content.replace(/const\s+prisma\s*=\s*new\s+PrismaClient\(\);?/g, '');
    
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log("Fixed:", relPath);
  } else {
    console.log("Not found:", relPath);
  }
});
