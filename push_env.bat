call npx vercel env rm DATABASE_URL production -y
echo postgresql://postgres.gjexrxdyddystmvrgsoe:Imperialdreams2055@aws-1-eu-north-1.pooler.supabase.com:6543/postgres?pgbouncer=true | call npx vercel env add DATABASE_URL production

call npx vercel env rm DIRECT_URL production -y
echo postgresql://postgres:Imperialdreams2055@db.gjexrxdyddystmvrgsoe.supabase.co:5432/postgres | call npx vercel env add DIRECT_URL production

call npx vercel env rm NEXT_PUBLIC_SUPABASE_URL production -y
echo https://gjexrxdyddystmvrgsoe.supabase.co | call npx vercel env add NEXT_PUBLIC_SUPABASE_URL production

call npx vercel env rm NEXT_PUBLIC_SUPABASE_ANON_KEY production -y
echo eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqZXhyeGR5ZGR5c3RtdnJnc29lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwNDQ1MTgsImV4cCI6MjA5NjYyMDUxOH0.LJB24eXhrGaLwTaQuqgZwVNNumRL3jngffGfRy2hcMg | call npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production

call npx vercel env rm SUPABASE_SERVICE_ROLE_KEY production -y
echo eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqZXhyeGR5ZGR5c3RtdnJnc29lIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTA0NDUxOCwiZXhwIjoyMDk2NjIwNTE4fQ.RNkntkt66KXzsUo9u3EVPXBWN9wHiQAWVsunslBeEmw | call npx vercel env add SUPABASE_SERVICE_ROLE_KEY production

call npx vercel env rm JWT_SECRET production -y
echo dev-secret-key-123 | call npx vercel env add JWT_SECRET production

call npx vercel --prod --yes --force
