param (
    [Parameter(Mandatory=$true)]
    [string]$commitMessage
)

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "🛡️ VERCEL SECURE DEPLOYMENT MODULE 🛡️" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Doel: Voorkomen van gefaalde Vercel deploys en inbox spam."
Write-Host ""

Write-Host "[1/2] Running Vercel-Grade Build (Typecheck + Next Build)..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ BUILD FAILED. Fix de TypeScript/Next.js errors voordat je pusht!" -ForegroundColor Red
    cd ..\..
    exit 1
}
Write-Host "✅ Build passed. Code is 1000% Vercel-ready." -ForegroundColor Green
Write-Host ""

Write-Host "[2/2] Pushing to GitHub & Triggering Vercel..." -ForegroundColor Yellow
cd ..\..
git add .
git commit -m $commitMessage
git push
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Git Push gefaald." -ForegroundColor Red
    exit 1
}

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "✅ SECURE DEPLOYMENT SUCCESSFUL" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Cyan
