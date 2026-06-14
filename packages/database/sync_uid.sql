-- SYNC SCRIPT: Zorg dat Prisma User ID gelijk is aan Supabase Auth UID
-- Dit is cruciaal om te zorgen dat RLS (Row Level Security) je niet per ongeluk buitensluit!

UPDATE public."User" u
SET id = a.id::text
FROM auth.users a
WHERE u.email = a.email;
