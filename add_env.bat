@echo off
npx vercel env rm DATABASE_URL production -y
npx vercel env rm DIRECT_URL production -y
npx vercel env rm JWT_SECRET production -y

(set /p="postgresql://postgres.gjexrxdyddystmvrgsoe:Imperialdreams2055@aws-1-eu-north-1.pooler.supabase.com:6543/postgres?pgbouncer=true" <nul) | npx vercel env add DATABASE_URL production
(set /p="postgresql://postgres.gjexrxdyddystmvrgsoe:Imperialdreams2055@aws-1-eu-north-1.pooler.supabase.com:5432/postgres" <nul) | npx vercel env add DIRECT_URL production
(set /p="dev-secret" <nul) | npx vercel env add JWT_SECRET production
