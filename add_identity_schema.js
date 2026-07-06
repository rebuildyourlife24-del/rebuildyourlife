const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'packages', 'database', 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

// Add the relation fields to the User model
if (!schema.includes('organizationMembers OrganizationMember[]')) {
    // Find the end of the User model
    const userModelStart = schema.indexOf('model User {');
    const userModelEnd = schema.indexOf('}', userModelStart);
    
    const relations = `
  organizationMembers    OrganizationMember[]
  workspaceMembers       WorkspaceMember[]
`;
    schema = schema.slice(0, userModelEnd) + relations + schema.slice(userModelEnd);
}

// Add the new models
const newModels = `
// ==========================================
// RYL OS IDENTITY DOMAIN (CORE SERVICES)
// ==========================================

model Organization {
  id        String   @id @default(uuid())
  name      String
  slug      String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  status    String   @default("ACTIVE") // ACTIVE, SUSPENDED, DELETED

  workspaces Workspace[]
  members    OrganizationMember[]
}

model Workspace {
  id             String       @id @default(uuid())
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  name           String
  slug           String       @unique
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt

  members        WorkspaceMember[]
}

model OrganizationMember {
  id             String       @id @default(uuid())
  organizationId String
  userId         String
  role           String       @default("MEMBER") // OWNER, ADMIN, MEMBER
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt

  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  user           User         @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([organizationId, userId])
}

model WorkspaceMember {
  id          String    @id @default(uuid())
  workspaceId String
  userId      String
  role        String    @default("MEMBER") // ADMIN, EDITOR, VIEWER
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  workspace   Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([workspaceId, userId])
}

// RBAC
model Role {
  id          String   @id @default(uuid())
  name        String   @unique
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  permissions RolePermission[]
}

model Permission {
  id          String   @id @default(uuid())
  action      String   // e.g., "create:agent", "read:billing"
  resource    String   // e.g., "agent", "billing"
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  roles       RolePermission[]

  @@unique([action, resource])
}

model RolePermission {
  roleId       String
  permissionId String

  role         Role       @relation(fields: [roleId], references: [id], onDelete: Cascade)
  permission   Permission @relation(fields: [permissionId], references: [id], onDelete: Cascade)

  @@id([roleId, permissionId])
}
`;

if (!schema.includes('model Organization {')) {
    schema += newModels;
}

fs.writeFileSync(schemaPath, schema);
console.log('Successfully injected Identity Domain models into schema.prisma');
