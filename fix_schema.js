const fs = require('fs');

const path = 'packages/database/prisma/schema.prisma';
let lines = fs.readFileSync(path, 'utf8').split('\n');

const idx = lines.findIndex(l => l.startsWith('model GeneratedCopy'));
if (idx !== -1) {
  lines.splice(idx, lines.length - idx);
}

const append = `model GeneratedCopy {
  id              String   @id @default(uuid())
  userId          String
  projectType     String   // AD, EMAIL, LANDING_PAGE, SOCIAL_POST
  topic           String
  tone            String   @default("PROFESSIONEEL")
  content         String   @db.Text
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([projectType])
}

model CrmLead {
  id              String   @id @default(uuid())
  userId          String
  name            String
  email           String?
  company         String?
  stage           String   @default("NEW") // NEW, CONTACTED, PROPOSAL, WON, LOST
  value           Float?
  notes           String?  @db.Text
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([stage])
}
`;

fs.writeFileSync(path, lines.join('\n') + append, 'utf8');
console.log("Fixed by truncating at GeneratedCopy!");
