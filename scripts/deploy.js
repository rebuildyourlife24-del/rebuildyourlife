const { execSync } = require('child_process');

console.log("\n==============================================");
console.log("🚀 FOUTLOZE INZET MODULE (FLAWLESS DEPLOYMENT)");
console.log("==============================================\n");

try {
    console.log("🛠️ STAP 1: Validatie & Build (turbo run build)...");
    // This will run next build and catch TypeScript/ESLint errors
    execSync("npm run build", { stdio: 'inherit' });
    
    console.log("\n✅ STAP 1 SUCCESVOL: Geen build errors gevonden.");
    
    console.log("\n🚀 STAP 2: Live zetten naar Vercel (Production)...");
    execSync("npx vercel --prod --yes", { stdio: 'inherit' });
    
    console.log("\n🎉 INZET SUCCESVOL! De applicatie is foutloos live gezet.");
} catch (error) {
    console.error("\n❌ INZET GEANNULEERD: Er zijn fouten gevonden in de code. Fix deze lokaal voordat je naar Vercel pusht.");
    process.exit(1);
}
