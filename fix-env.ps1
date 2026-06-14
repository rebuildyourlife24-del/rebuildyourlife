$envValue = "postgresql://postgres.gjexrxdyddystmvrgsoe:Imperialdreams2055@aws-1-eu-north-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

Write-Host "Removing old DATABASE_URL..."
npx vercel env rm DATABASE_URL production -y
npx vercel env rm DATABASE_URL preview -y
npx vercel env rm DATABASE_URL development -y

Write-Host "Adding new DATABASE_URL..."
$envValue | npx vercel env add DATABASE_URL production
$envValue | npx vercel env add DATABASE_URL preview
$envValue | npx vercel env add DATABASE_URL development

Write-Host "Triggering redeploy..."
npx vercel --prod --yes
