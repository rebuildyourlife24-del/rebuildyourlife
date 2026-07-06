require('dotenv').config({ path: 'apps/api/.env' });
const { routeToAgent } = require("./apps/api/dist/services/ai.service.js");

console.log("\n=======================================================");
console.log("   [TEST] SOVEREIGN E-COMMERCE AGENT ROUTER");
console.log("=======================================================\n");

const testCases = [
  {
    text: "Hoeveel stock hebben we nog van SKU-102 in ons magazijn?",
    expected: "ECOM_CATALOG"
  },
  {
    text: "Wat zijn de prijzen van onze concurrenten en moeten we onze marge aanpassen?",
    expected: "ECOM_PRICING"
  },
  {
    text: "Maak een betaling aan via Stripe en geef me de checkout link.",
    expected: "ECOM_CHECKOUT"
  },
  {
    text: "Ik wil mijn bestelling retourneren, hoe kan ik een retourlabel krijgen?",
    expected: "ECOM_CUSTOMER_SERVICE"
  },
  {
    text: "Plaats een inkooporder bij onze leverancier voor 100 stuks.",
    expected: "ECOM_SUPPLY_CHAIN"
  },
  {
    text: "Genereer gestructureerde JSON-LD data om onze SEO vindbaarheid in Google te verbeteren.",
    expected: "ECOM_SEO"
  },
  {
    text: "Schrijf een wervende productbeschrijving voor onze nieuwe collectie.",
    expected: "ECOM_MERCHANDISING"
  },
  {
    text: "Monitort de klik-data en waarschuw me via een slack alert bij een conversie drop.",
    expected: "ECOM_OPERATIONS"
  }
];

let passedCount = 0;

testCases.forEach((test, index) => {
  try {
    const result = routeToAgent(test.text);
    const passed = result === test.expected;
    if (passed) passedCount++;
    console.log(`[TEST ${index + 1}] ${passed ? "✅ PASSED" : "❌ FAILED"}`);
    console.log(`- Bericht:  "${test.text}"`);
    console.log(`- Router:   ${result}`);
    console.log(`- Verwacht: ${test.expected}\n`);
  } catch (err) {
    console.error(`[TEST ${index + 1}] 💥 ERROR:`, err.message);
  }
});

console.log("=======================================================");
console.log(`RESULTAAT: ${passedCount}/${testCases.length} tests geslaagd!`);
console.log("=======================================================\n");

if (passedCount === testCases.length) {
  process.exit(0);
} else {
  process.exit(1);
}
