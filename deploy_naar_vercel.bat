@echo off
echo ===================================================
echo = APEX PREDATOR DEPLOYMENT SCRIPT (Vercel)        =
echo ===================================================

echo Stap 1: Koppelen aan je Vercel account (hsemler50@gmail.com)
call npx vercel link --yes

echo.
echo Stap 2: Database Environment Variabelen instellen in Vercel...
echo postgresql://postgres.gjexrxdyddystmvrgsoe:Imperialdreams2055@aws-1-eu-north-1.pooler.supabase.com:6543/postgres?pgbouncer=true | call npx vercel env add DATABASE_URL production
echo postgresql://postgres.gjexrxdyddystmvrgsoe:Imperialdreams2055@aws-1-eu-north-1.pooler.supabase.com:5432/postgres | call npx vercel env add DIRECT_URL production
echo https://gjexrxdyddystmvrgsoe.supabase.co | call npx vercel env add NEXT_PUBLIC_SUPABASE_URL production
echo eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqZXhyeGR5ZGR5c3RtdnJnc29lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwNDQ1MTgsImV4cCI6MjA5NjYyMDUxOH0.LJB24eXhrGaLwTaQuqgZwVNNumRL3jngffGfRy2hcMg | call npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production

echo.
echo Stap 3: Volledige Productie Deployment Starten...
call npx vercel --prod --yes --force

echo.
echo ===================================================
echo = DEPLOYMENT VOLTOOID. THE SYSTEM IS ONLINE.      =
echo ===================================================
pause
