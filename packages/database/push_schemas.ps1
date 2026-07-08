$ErrorActionPreference = "Stop"

$dbs = @(
    @{ Name="Orion"; Url="postgresql://postgres.gjexrxdyddystmvrgsoe:Imperialdreams2055@aws-1-eu-north-1.pooler.supabase.com:6543/postgres?pgbouncer=true" },
    @{ Name="Hermes"; Url="postgresql://postgres:Imperialdreams2055@db.mierxiaxihzvimadsxhk.supabase.co:5432/postgres" },
    @{ Name="Quantum"; Url="postgresql://postgres:spUi4TQma1Q0H0ju@db.ljmoqymvkzyvvrhgbgtu.supabase.co:5432/postgres" },
    @{ Name="Vault"; Url="postgresql://postgres:e16bnjc7Yum3rh6O@db.xdffrzojcpmmzksfkobo.supabase.co:5432/postgres" },
    @{ Name="Sovereign"; Url="postgresql://postgres:2epcJUh1FXIiqyjc@db.nwnaefxuapmllsdijwig.supabase.co:5432/postgres" }
)

Write-Host "=== STARTING PENTA-BRAIN PRISMA PUSH ==="

foreach ($db in $dbs) {
    Write-Host "`n[*] Pushing Master Schema to $($db.Name)..."
    $env:DATABASE_URL = $db.Url
    node .\node_modules\prisma\build\index.js db push --accept-data-loss
    Write-Host "[+] SUCCESS: $($db.Name) is fully deployed!"
}

Write-Host "`n=== DEPLOYMENT COMPLETE ==="
