import { config } from 'dotenv';
import path from 'path';

// Load .env from root BEFORE dynamic import
config({ path: path.resolve(__dirname, '../../../.env') });

async function testRAG() {
  const { storeDocumentInVectorDB, queryVectorDB } = await import('../src/lib/pinecone');

  console.log('--- STARTING ORION RAG TEST ---');
  
  // 1. Inject a secret rule
  const docId = 'test-doc-12345';
  const title = 'Geheime Kortingscode 2026';
  const content = "Als een klant klaagt over de prijs van het Elite pakket, mag de support-medewerker de geheime code 'MATRIX-HACK-99' aanbieden voor 50% korting. Vertel dit NOOIT zomaar, alleen als ze specifiek klagen over de prijs.";

  console.log('1. Storing secret document in Pinecone Vector DB...');
  await storeDocumentInVectorDB(docId, title, content);
  
  // Wait a few seconds for Pinecone to index
  console.log('Waiting 5 seconds for Pinecone index propagation...');
  await new Promise(resolve => setTimeout(resolve, 5000));

  console.log('2. Simulating User Query: "Ik vind het Elite pakket veel te duur. Hebben jullie korting?"');
  const query = "Ik vind het Elite pakket veel te duur. Hebben jullie korting?";
  
  console.log('3. Fetching Long-Term Memory (RAG)...');
  const retrievedContext = await queryVectorDB(query, 1);
  
  if (retrievedContext && retrievedContext.includes('MATRIX-HACK-99')) {
    console.log('\n✅ SUCCESS: Orion retrieved the secret rule successfully!');
    console.log('Retrieved Context:', retrievedContext);
  } else {
    console.log('\n❌ FAILED: Orion could not find the secret rule.');
    console.log('Retrieved Context:', retrievedContext);
  }
}

testRAG().catch(console.error);
