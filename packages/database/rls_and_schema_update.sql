-- 1. SCHEMAUITBREIDING: Soft Deletes
ALTER TABLE "User" 
ADD COLUMN IF NOT EXISTS "deletedAt" timestamp(3) without time zone;

-- 2. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;

-- 3. RLS POLICIES AANMAKEN
-- (Oude policies eventueel verwijderen als de vorige run half gelukt is)
DROP POLICY IF EXISTS "Users can view own profile" ON "User";
DROP POLICY IF EXISTS "Users can update own profile" ON "User";
DROP POLICY IF EXISTS "Users cannot delete profiles" ON "User";
DROP POLICY IF EXISTS "Super Admins can view all profiles" ON "User";

-- Policy A: Gebruikers mogen alleen hun eigen profiel uitlezen
-- auth.uid() is een UUID, onze id is TEXT. Dus we moeten casten met ::text
CREATE POLICY "Users can view own profile"
ON "User"
FOR SELECT
USING (auth.uid()::text = id);

-- Policy B: Gebruikers mogen alleen hun eigen profiel updaten
CREATE POLICY "Users can update own profile"
ON "User"
FOR UPDATE
USING (auth.uid()::text = id);

-- Policy C: Beveiliging tegen verwijderen (Gebruik soft-delete in plaats daarvan)
CREATE POLICY "Users cannot delete profiles"
ON "User"
FOR DELETE
USING (false);

-- Policy D: Super Admins kunnen alles uitlezen (als ze de rol SUPER_ADMIN hebben)
CREATE POLICY "Super Admins can view all profiles"
ON "User"
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM "User" u
    WHERE u.id = auth.uid()::text AND u.role = 'SUPER_ADMIN'
  )
);
