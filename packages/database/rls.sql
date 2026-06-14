-- Enable RLS on the User table
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;

-- Policy 1: Users can read their own profile
CREATE POLICY "Users can view own profile"
ON "User"
FOR SELECT
USING (auth.uid() = id);

-- Policy 2: Users can update their own profile
CREATE POLICY "Users can update own profile"
ON "User"
FOR UPDATE
USING (auth.uid() = id);

-- Policy 3: Super Admins can view all profiles
-- Note: Requires a way to identify SUPER_ADMIN, assuming 'SUPER_ADMIN' role
CREATE POLICY "Super Admins can view all profiles"
ON "User"
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM "User" u
    WHERE u.id = auth.uid() AND u.role = 'SUPER_ADMIN'
  )
);

-- Note: Because Prisma connects as the 'postgres' user, it normally bypasses RLS.
-- To force RLS for Prisma, you would need to use a non-superuser connection or 
-- explicitly set the role and jwt.claims in the transaction.
-- For now, these policies secure the tables against direct Supabase API access.
